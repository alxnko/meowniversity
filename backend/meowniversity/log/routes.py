from flask import request, Blueprint, session
from flask_login import current_user
from meowniversity.models import Log
from meowniversity import db

log = Blueprint("log", __name__)


def add_log(action):
    log = Log(text=action)
    db.session.add(log)
    db.session.commit()


def log_to_dict(log: Log):
    return {
        "id": log.id,
        "time": log.time,
        "action": log.text
    }


@log.route("/api/l/get_logs")
def get_logs():
    if session["type"] != "admin":
        return {"error": "noRights"}
    add_log("admin " + current_user.username + " requested all logs")
    return {"logs": [log_to_dict(log) for log in Log.query.all()][::-1]}
