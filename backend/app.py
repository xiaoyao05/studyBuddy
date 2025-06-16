from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
from config import ApplicationConfig
from models import db, Profile, StudySession

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = Profile.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["Email"]
    password = request.json["Password"]
    name = request.json["Name"]
    course = request.json["Course"]
    year = request.json["Year"]
    gender = request.json["Gender"]
    tele = request.json["Telegram Handle"]

    user_exists = Profile.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Profile(email=email, password=hashed_password, name=name, course=course, year=year, gender=gender, tele=tele)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = Profile.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

@app.route("/edit-profile", methods=["PUT"])
def edit_profile():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    user = Profile.query.get(session["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # Optional fields: update only if present in request
    if "Name" in data:
        user.name = data["Name"]
    if "Course" in data:
        user.course = data["Course"]
    if "Year" in data:
        user.year = data["Year"]
    if "Gender" in data:
        user.gender = data["Gender"]
    if "Telegram Handle" in data:
        user.tele = data["Telegram Handle"]

    try:
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "name": user.name,
            "course": user.course,
            "year": user.year,
            "gender": user.gender,
            "tele": user.tele
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/create-session", methods=["POST"])
def create_session():
    name = request.json["Group Name"]
    groupSize = request.json["Maximum Participants"]
    date = request.json["Date"]
    startTime = request.json["Start Time"]
    endTime = request.json["End Time"]
    location = request.json["Location"]
    description = request.json["Description"]
    module = request.json["Module (optional)"]

    session_exists = StudySession.query.filter_by(name=name).first() is not None

    if session_exists:
        return jsonify({"error": "Session name is used"}), 409

    new_session = StudySession(name=name, groupSize=groupSize, date=date, startTime=startTime, endTime=endTime, location=location, description=description, module=module)
    db.session.add(new_session)
    db.session.commit()

    return jsonify({
        "id": new_session.id
    })

if __name__ == "__main__":
    app.run(debug=True)