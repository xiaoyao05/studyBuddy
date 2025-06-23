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
    password = db.Column(db.Text, nullable=False)
    course = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(20), nullable=False)
    gender = db.Column(db.Enum("Male", "Female", "Other", name="gender_enum"), nullable=False)
    tele = db.Column(db.String(20), nullable=False, unique=True)

    requests = db.relationship("Request", backref="student", passive_deletes=True)
    joined_sessions = db.relationship("Participation", backref="student", passive_deletes=True)
    sessions_hosted = db.relationship("StudySession", backref="admin_profile", passive_deletes=True)

class StudySession(db.Model):
    __tablename__ = "StudySession"
    studySessionID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    admin = db.Column(
        db.String(32),
        db.ForeignKey("Profile.id", ondelete="CASCADE"),
        nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    groupSize = db.Column(db.Integer, nullable=False)
    module = db.Column(db.String(20), nullable=True)
    date = db.Column(db.Date, nullable=False)
    startTime = db.Column(db.Time, nullable=False)
    endTime = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

    requests = db.relationship("Request", backref="study_session", passive_deletes=True)
    participants = db.relationship("Participation", backref="study_session", passive_deletes=True)

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
    status = db.Column(
        db.Enum("pending", "approved", "rejected", name="request_status_enum"),
        nullable=False,
        default="pending"
    )
    dateTime = db.Column(db.DateTime, nullable=False)

class Participation(db.Model):
    __tablename__ = "Participation"
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