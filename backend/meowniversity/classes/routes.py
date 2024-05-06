from flask import request, Blueprint, session
from flask_login import current_user, logout_user, login_required
from meowniversity.models import Class, Grade, Student
from meowniversity import db
from meowniversity.log.routes import add_log

classes = Blueprint("classes", __name__)


def class_to_dict_for_admin(class_: Class):
    quizGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.type == "quiz")]
    midtermGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.type == "midterm")]
    finalGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.type == "final")]
    return {
        "id": class_.id,
        "name": class_.name,
        "description": class_.description,
        "averageGrade": sum([grade.grade for grade in class_.grades]) // len(class_.grades) if len(class_.grades) > 0 else 0,
        "quizAverage": sum(quizGrades) // len(quizGrades) if len(quizGrades) > 0 else 0,
        "midtermAverage": sum(midtermGrades) // len(midtermGrades) if len(midtermGrades) > 0 else 0,
        "finalAverage": sum(finalGrades) // len(finalGrades) if len(finalGrades) > 0 else 0,
        "quizCount": len(quizGrades),
        "midtermCount": len(midtermGrades),
        "finalCount": len(finalGrades),
        "all": Student.query.count()
    }


def class_to_dict(class_: Class):
    grades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.student_id == current_user.id)]
    quizGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.student_id == current_user.id, Grade.type == "quiz")]
    midtermGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.student_id == current_user.id, Grade.type == "midterm")]
    finalGrades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.student_id == current_user.id, Grade.type == "final")]
    return {
        "id": class_.id,
        "name": class_.name,
        "description": class_.description,
        "averageGrade": sum(grades) // len(grades) if len(grades) > 0 else 0,
        "quizAverage": sum(quizGrades) // len(quizGrades) if len(quizGrades) > 0 else 0,
        "midtermAverage": sum(midtermGrades) // len(midtermGrades) if len(midtermGrades) > 0 else 0,
        "finalAverage": sum(finalGrades) // len(finalGrades) if len(finalGrades) > 0 else 0,
    }


@classes.route("/api/c/add_class", methods=["POST"])
def add_class():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    class_ = Class(
        name=data["name"],
        description=data["description"],
    )
    add_log(f"admin {current_user.username} added class {data['name']}")
    db.session.add(class_)
    db.session.commit()
    return class_to_dict_for_admin(class_)


@classes.route("/api/c/get_my_classes")
@login_required
def get_my_classes():
    add_log(f"student {current_user.username} requested classes")
    return {"classes": [class_to_dict(class_) for class_ in Class.query.all()][::-1]}


@classes.route("/api/c/get_classes")
def get_classes():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log("admin " + current_user.username + " requested all classes")
    return {"classes": [class_to_dict_for_admin(class_) for class_ in Class.query.all()][::-1]}


@classes.route("/api/c/delete_class", methods=["POST"])
def delete_class():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    class_ = Class.query.filter_by(id=data["id"]).first()
    add_log(f"admin {current_user.username} deleted class {class_.name}")
    db.session.delete(class_)
    db.session.commit()
    return {"success": True}


@classes.route("/api/c/edit_class", methods=["POST"])
def edit_class():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    class_ = Class.query.filter_by(id=data["id"]).first()
    class_.name = data["name"]
    class_.description = data["description"]
    add_log(f"admin {current_user.username} edited class {class_.name}")
    db.session.commit()
    return class_to_dict_for_admin(class_)
