from flask import request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from meowniversity.models import Class, Grade
from meowniversity import db

classes = Blueprint("classes", __name__)


def class_to_dict_for_admin(class_: Class):
    return {
        "id": class_.id,
        "name": class_.name,
        "description": class_.description,
        "averageGrade": sum([grade.grade for grade in class_.grades]) // len(class_.grades) if len(class_.grades) > 0 else 0,
    }


def class_to_dict(class_: Class):
    grades = [grade.grade for grade in Grade.query.filter(
        Grade.class_id == class_.id, Grade.student_id == current_user.id)]
    return {
        "id": class_.id,
        "name": class_.name,
        "description": class_.description,
        "averageGrade": sum(grades) // len(grades) if len(grades) > 0 else 0,
    }


@classes.route("/api/c/add_class", methods=["POST"])
def add_class():
    data = request.get_json()
    class_ = Class(
        name=data["name"],
        description=data["description"],
    )
    db.session.add(class_)
    db.session.commit()
    return class_to_dict_for_admin(class_)


@classes.route("/api/c/get_my_classes")
def get_my_classes():
    return {"classes": [class_to_dict(class_) for class_ in Class.query.all()][::-1]}


@classes.route("/api/c/get_classes")
def get_classes():
    return {"classes": [class_to_dict_for_admin(class_) for class_ in Class.query.all()][::-1]}


@classes.route("/api/c/delete_class", methods=["POST"])
def delete_class():
    data = request.get_json()
    class_ = Class.query.filter_by(id=data["id"]).first()
    db.session.delete(class_)
    db.session.commit()
    return {"success": True}


@classes.route("/api/c/edit_class", methods=["POST"])
def edit_class():
    data = request.get_json()
    class_ = Class.query.filter_by(id=data["id"]).first()
    class_.name = data["name"]
    class_.description = data["description"]
    db.session.commit()
    return class_to_dict_for_admin(class_)
