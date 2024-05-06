from flask import request, Blueprint, session
from flask_login import current_user, login_required
from meowniversity.models import Grade, Student, Class, Admin
from meowniversity import db
from meowniversity.log.routes import add_log

grades = Blueprint("grades", __name__)


def grade_to_dict(grade: Grade):
    student = Student.query.filter_by(id=grade.student_id).first()
    teacher = Admin.query.filter_by(id=grade.admin_id).first()
    return {
        "id": grade.id,
        "username": student.username,
        "name": student.name,
        "student_id": grade.student_id,
        "class_id": grade.class_id,
        "className": Class.query.filter_by(id=grade.class_id).first().name,
        "time": grade.time,
        "type": grade.type,
        "grade": grade.grade,
        "teacher": teacher.name if teacher else "unknown"
    }


@grades.route("/api/g/get_my_grades")
@login_required
def get_my_grades():
    add_log(f"student {current_user.username} requested grades")
    return {"grades": [grade_to_dict(grade) for grade in Grade.query.filter_by(student_id=current_user.id).all()][::-1]}


@grades.route("/api/g/add_grade", methods=["POST"])
def add_grade():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    grade = Grade(
        student_id=Student.query.filter_by(
            username=data["username"]).first().id,
        class_id=Class.query.filter_by(name=data["className"]).first().id,
        type=data["type"],
        grade=data["grade"],
        admin_id=current_user.id
    )
    add_log(
        f"admin {current_user.username} added grade {data['username']} {data['className']} {data['type']} {data['grade']}")
    db.session.add(grade)
    db.session.commit()
    return grade_to_dict(grade)


@grades.route("/api/g/get_grades")
def get_grades():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log("admin " + current_user.username + " requested all grades")
    return {"grades": [grade_to_dict(grade) for grade in Grade.query.all()][::-1]}


@grades.route("/api/g/delete_grade", methods=["POST"])
def delete_grade():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    grade = Grade.query.filter_by(id=data["id"]).first()
    add_log(
        f"admin {current_user.username} deleted grade {grade.username} {grade.className} {grade.type} {grade.grade}")
    db.session.delete(grade)
    db.session.commit()
    return {"success": True}


@grades.route("/api/g/edit_grade", methods=["POST"])
def edit_grade():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    grade = Grade.query.filter_by(id=data["id"]).first()
    grade.type = data["type"]
    grade.grade = data["grade"]
    add_log(
        f"admin {current_user.username} edited grade {grade.username} {grade.className} {grade.type} {grade.grade}")
    db.session.commit()
    return grade_to_dict(grade)
