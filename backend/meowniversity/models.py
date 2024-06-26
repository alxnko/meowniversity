from flask import session
from datetime import datetime, timedelta
from meowniversity import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    if "type" in session:
        type = session["type"]
        if type == 'admin':
            return Admin.query.get(int(user_id))
        return Student.query.get(int(user_id))
    return None


class Student(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    grades = db.relationship('Grade', backref='student', lazy=True)
    feedbacks = db.relationship('Feedback', backref='student', lazy=True)


class Admin(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    grades = db.relationship('Grade', backref='admin', lazy=True)


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    grades = db.relationship('Grade', backref='class', lazy=True)


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey(
        'student.id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('class.id'), nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.now())
    type = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)


class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.now())
    student_id = db.Column(db.Integer, db.ForeignKey(
        'student.id'), nullable=False)


class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.DateTime, nullable=False, default=datetime.now())
    text = db.Column(db.Text, nullable=False)
