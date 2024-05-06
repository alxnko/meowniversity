from flask import request, Blueprint, session
from flask_login import current_user, login_required
from meowniversity.models import Feedback, Student
from meowniversity import db
from meowniversity.log.routes import add_log

feedback = Blueprint("feedback", __name__)


def feedback_to_dict(feedback: Feedback):
    return {
        "id": feedback.id,
        "text": feedback.text,
        "time": feedback.time,
        "student": Student.query.filter_by(id=feedback.student_id).first().name
    }


@feedback.route("/api/f/add_feedback", methods=["POST"])
@login_required
def add_feedback():
    data = request.get_json()
    feedback = Feedback(
        text=data["text"],
        student_id=current_user.id
    )
    add_log(
        f"student {current_user.username} added feedback {data['text']}")
    db.session.add(feedback)
    db.session.commit()
    return feedback_to_dict(feedback)


@feedback.route("/api/f/delete_feedback", methods=["POST"])
def remove_feedback():
    if session["type"] != "admin":
        return {"error": "noRights"}
    data = request.get_json()
    feedback = Feedback.query.filter_by(id=data["id"]).first()
    add_log(f"admin {current_user.username} removed feedback {feedback.text}")
    db.session.delete(feedback)
    db.session.commit()
    return feedback_to_dict(feedback)


@feedback.route("/api/f/get_feedbacks")
def get_feedbacks():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log("admin " + current_user.username + " requested all feedbacks")
    return {"feedbacks": [feedback_to_dict(feedback) for feedback in Feedback.query.all()][::-1]}
