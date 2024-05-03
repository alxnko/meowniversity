from flask import request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from meowniversity.models import Student
from meowniversity import db

users = Blueprint("users", __name__)


def user_to_dict_for_admin(user: Student):
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "password": user.password,
        "email": user.email,
        "phone": user.phone,
        "averageGrade": sum([grade.grade for grade in user.grades]) / len(user.grades) if len(user.grades) > 0 else 0,
    }
    
def user_to_dict(user: Student):
    return {
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "averageGrade": sum([grade.grade for grade in user.grades]) / len(user.grades) if len(user.grades) > 0 else 0,
    }

@users.route("/api/u/get_current_user")
def get_user():
    return user_to_dict_for_admin(current_user) if current_user.is_authenticated else {"error": "notAuth"}


@users.route("/api/u/get_users")
def get_users():
    return {"users": [user_to_dict_for_admin(user) for user in Student.query.all()][::-1]}

@users.route("/api/u/add_user", methods=["POST"])
def add_user():
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
    )
    db.session.add(user)
    db.session.commit()
    return user_to_dict_for_admin(user)

@users.route("/api/u/login", methods=["POST"])
def login():
    data = request.get_json()
    user = Student.query.filter_by(username=data["username"]).first()
    if user and user.password == data["password"]:
        login_user(user, remember=True)
        return user_to_dict_for_admin(user)
    return {"error": "Bad username or password"}

@users.route("/api/u/logout")
@login_required
def logout():
    logout_user()
    return {"success": True}

@users.route("/api/u/get_top")
def get_top():
    users = [user for user in Student.query.all()]
    return {"users": [user_to_dict(user) for user in sorted(users, key=lambda user: sum([grade.grade for grade in user.grades]) / len(user.grades) if len(user.grades) > 0 else 0, reverse=True)]}

@users.route("/api/u/delete_user", methods=["POST"])
def delete_user():
    data = request.get_json()
    user = Student.query.filter_by(id=data["id"]).first()
    db.session.delete(user)
    db.session.commit()
    return {"success": True}

@users.route("/api/u/edit_user", methods=["POST"])
def edit_user():
    data = request.get_json()
    user = Student.query.filter_by(id=data["id"]).first()
    user.username = data["username"]
    user.name = data["name"]
    user.password = data["password"]
    user.email = data["email"]
    user.phone = data["phone"]
    db.session.commit()
    return user_to_dict_for_admin(user)

@users.route("/api/u/admin_login", methods=["POST"])
def admin_login():
    data = request.get_json()
    return {"isAdmin": data['password'] == "meowniversity"}