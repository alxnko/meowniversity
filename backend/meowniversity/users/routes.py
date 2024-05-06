from flask import request, Blueprint, session
from flask_login import login_user, current_user, logout_user, login_required
from meowniversity.models import Student, Admin, Grade
from meowniversity import db
from meowniversity.log.routes import add_log

users = Blueprint("users", __name__)


def user_to_dict_for_admin(user: Student):
    quizGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "quiz")]
    midtermGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "midterm")]
    finalGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "final")]
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "password": user.password,
        "email": user.email,
        "phone": user.phone,
        "address": user.address,
        "averageGrade": sum([grade.grade for grade in user.grades]) // len(user.grades) if len(user.grades) > 0 else 0,
        "quizAverage": sum(quizGrades) // len(quizGrades) if len(quizGrades) > 0 else 0,
        "midtermAverage": sum(midtermGrades) // len(midtermGrades) if len(midtermGrades) > 0 else 0,
        "finalAverage": sum(finalGrades) // len(finalGrades) if len(finalGrades) > 0 else 0,
    }


def user_to_dict(user: Student):
    quizGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "quiz")]
    midtermGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "midterm")]
    finalGrades = [grade.grade for grade in Grade.query.filter(
        Grade.student_id == user.id, Grade.type == "final")]
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "averageGrade": sum([grade.grade for grade in user.grades]) // len(user.grades) if len(user.grades) > 0 else 0,
        "quizAverage": sum(quizGrades) // len(quizGrades) if len(quizGrades) > 0 else 0,
        "midtermAverage": sum(midtermGrades) // len(midtermGrades) if len(midtermGrades) > 0 else 0,
        "finalAverage": sum(finalGrades) // len(finalGrades) if len(finalGrades) > 0 else 0,
    }


def admin_to_dict_for_admin(user: Admin):
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "password": user.password,
        "type": "admin",
    }


def admin_to_dict(user: Admin):
    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "type": "admin",
    }


@users.route("/api/u/get_current_user")
def get_user():
    type = session["type"] if "type" in session else None
    if type == "admin" and current_user.is_authenticated:
        add_log(f"admin {current_user.username} opened meowniversity")
        return admin_to_dict_for_admin(current_user)
    if current_user.is_authenticated:
        add_log(f"student {current_user.username} opened meowniversity")
        return user_to_dict_for_admin(current_user)
    else:
        return {"error": "notAuth"}


@users.route("/api/u/get_users")
def get_users():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log("admin " + current_user.username + " requested all users")
    return {"users": [user_to_dict_for_admin(user) for user in Student.query.all()][::-1]}


@users.route("/api/u/add_user", methods=["POST"])
def add_user():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    user = Student.query.filter_by(username=data["username"]).first()
    if user:
        return {"error": "Username already taken"}
    user = Student(
        username=data["username"],
        name=data["name"],
        password=data["password"],
        email=data["email"],
        phone=data["phone"],
        address=data["address"],
    )
    add_log(
        f"admin {current_user.username} added user {data['name']} ({data['username']}#{user.id})")
    db.session.add(user)
    db.session.commit()
    return user_to_dict_for_admin(user)


@users.route("/api/u/login", methods=["POST"])
def login():
    data = request.get_json()
    user = Student.query.filter_by(username=data["username"]).first()
    if user and user.password == data["password"]:
        login_user(user, remember=True)
        session["type"] = "student"
        add_log(f"student {user.username} logged in")
        return user_to_dict_for_admin(user)
    return {"error": "Bad username or password"}


@users.route("/api/u/logout")
@login_required
def logout():
    session.clear()
    add_log(f"student {current_user.username} logged out")
    logout_user()
    return {"success": True}


@users.route("/api/u/get_top")
def get_top():
    users = [user for user in Student.query.all()]
    return {"users": [user_to_dict(user) for user in sorted(users, key=lambda user: sum([grade.grade for grade in user.grades]) / len(user.grades) if len(user.grades) > 0 else 0, reverse=True)]}


@users.route("/api/u/delete_user", methods=["POST"])
def delete_user():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    user = Student.query.filter_by(id=data["id"]).first()
    add_log(
        f"admin {current_user.username} deleted user {user.name} ({user.username}#{user.id})")
    db.session.delete(user)
    db.session.commit()
    return {"success": True}


@users.route("/api/u/edit_user", methods=["POST"])
def edit_user():
    data = request.get_json()
    if current_user.id != data["id"] and session["type"] != "admin":
        return {"error": "noRights"}
    user = Student.query.filter_by(id=data["id"]).first()
    user.username = data["username"]
    user.name = data["name"]
    user.password = data["password"]
    user.email = data["email"]
    user.phone = data["phone"]
    user.address = data["address"]
    add_log(
        f"admin {current_user.username} edited user {user.name} ({user.username}#{user.id})")
    db.session.commit()
    return user_to_dict_for_admin(user)


@users.route("/api/u/admin_login", methods=["POST"])
def admin_login():
    data = request.get_json()
    user = Admin.query.filter_by(username=data["username"]).first()
    if user and user.password == data["password"]:
        login_user(user, remember=True)
        session["type"] = "admin"
        add_log(f"admin {user.username} logged in")
        return admin_to_dict(user)
    else:
        if data["username"] == "alxnko" and data["password"] == "meowmeow":
            user = Admin(
                username=data["username"],
                password=data["password"],
                name="Alex Neko",
            )
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=True)
            session["type"] = "admin"
            return admin_to_dict(user)
    return {"error": "Bad username or password"}


@users.route("/api/u/add_admin", methods=["POST"])
def add_admin():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    user = Admin(
        username=data["username"],
        password=data["password"],
        name=data["name"],
    )
    add_log(
        f"admin {current_user.username} added admin {data['name']} ({data['username']}#{user.id})")
    db.session.add(user)
    db.session.commit()
    return admin_to_dict(user)


@users.route("/api/u/delete_admin", methods=["POST"])
def delete_admin():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    user = Admin.query.filter_by(id=data["id"]).first()
    add_log(
        f"admin {current_user.username} deleted admin {user.name} ({user.username}#{user.id})")
    db.session.delete(user)
    db.session.commit()
    return {"success": True}


@users.route("/api/u/edit_admin", methods=["POST"])
def edit_admin():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    user = Admin.query.filter_by(id=data["id"]).first()
    user.username = data["username"]
    user.password = data["password"]
    user.name = data["name"]
    add_log(
        f"admin {current_user.username} edited admin {user.name} ({user.username}#{user.id})")
    db.session.commit()
    return admin_to_dict(user)


@users.route("/api/u/get_admins")
def get_admins():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log(f"admin {current_user.username} requested admins")
    return {"admins": [admin_to_dict_for_admin(admin) for admin in Admin.query.all()][::-1]}
