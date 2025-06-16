from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import date, time, datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class Profile(db.Model):
    __tablename__ = "Profile"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    course = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.Enum("Male", "Female", "Other", name="gender_enum"), nullable=False)
    tele = db.Column(db.String(20), nullable=False, unique=True)

class StudySession(db.Model):
    __tablename__ = "StudySession"
    studySessionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    groupSize = db.Column(db.Integer, nullable=False)
    module = db.Column(db.String(20), nullable=False)
    date = db.Column(db.Date, nullable=False)
    startTime = db.Column(db.Time, nullable=False)
    endTime = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

class Request(db.Model):
    __tablename__ = "Request"
    reqID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    studentID = db.Column(
        db.String(32),
        db.ForeignKey("Profile.id", ondelete="CASCADE"),
        nullable=False
    )
    studySessionID = db.Column(
        db.Integer,
        db.ForeignKey("StudySession.studySessionID", ondelete="CASCADE"),
        nullable=False
    )
    greeting = db.Column(db.String(20), nullable=False)
    status = db.Column(db.Date, nullable=False)
    dateTime = db.Column(db.DateTime, nullable=False)

    student = db.relationship("Profile", backref="requests")
    study_session = db.relationship("StudySession", backref="requests")

class StudentSession(db.Model):
    tablename = "StudentSession"
    studentID = db.Column(
        db.String(32),
        db.ForeignKey("Profile.id", ondelete="CASCADE"),
        primary_key=True
    )
    studySessionID = db.Column(
        db.Integer,
        db.ForeignKey("StudySession.studySessionID", ondelete="CASCADE"),
        primary_key=True
    )

    student = db.relationship("Profile", backref="joined_sessions")
    study_session = db.relationship("StudySession", backref="participants")