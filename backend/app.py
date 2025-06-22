from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
from config import ApplicationConfig
from models import db, Profile, StudySession, Request, Participation
from datetime import datetime, date, time
from sqlalchemy import func, and_, or_
from models import StudySession, Participation

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    print("user_idMEEE", user_id)

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = Profile.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 

# register new account
@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    name = request.json["name"]
    course = request.json["course"]
    year = request.json["year"]
    gender = request.json["gender"]
    tele = request.json["telegramHandle"]

    user_exists = Profile.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
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

    print("haha", user.email, session["user_id"])

    return jsonify({
        "id": user.id,
        "email": user.email,
        "studentID": user.id
    })

# user log out
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

# retrieve study sessions
@app.route("/get-groups", methods=["GET"])
def get_all_groups():
    user_id = session.get("user_id")
    print("user_id", user_id)

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    today = date.today()
    now = datetime.now().time()

    # Query all future sessions with admin info and participant count
    results = (
        db.session.query(
            StudySession,
            Profile,
            func.count(Participation.studentID).label("participant_count")
        )
        .join(Profile, StudySession.admin == Profile.id)  # join admin
        .outerjoin(Participation, StudySession.studySessionID == Participation.studySessionID)
        .filter(
            or_(
                StudySession.date > today,
                and_(
                    StudySession.date == today,
                    StudySession.startTime > now
                )
            )
        )
        .group_by(StudySession.studySessionID, Profile.id)
        .order_by(StudySession.date.asc(), StudySession.startTime.asc())
        .all()
    )

    # Serialize to JSON
    output = []
    for s, admin, count in results:
        output.append({
            "sessionID": s.studySessionID,
            "name": s.name,
            "groupSize": s.groupSize,
            "module": s.module,
            "date": s.date.isoformat(),
            "startTime": s.startTime.strftime("%H:%M"),
            "endTime": s.endTime.strftime("%H:%M"),
            "location": s.location,
            "description": s.description,
            "admin": {
                "id": admin.id,
                "name": admin.name,
                "email": admin.email,
                "course": admin.course,
                "year": admin.year,
                "tele": admin.tele,
                "gender": admin.gender,
            },
            "participantCount": count
        })

    return jsonify(output)

# create new session
@app.route("/create-session", methods=["POST"])
def create_session():
    user_id = session.get("user_id")
    print("user_id", user_id)

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    name = request.json["name"]
    groupSize = request.json["maxPax"]
    date = datetime.fromisoformat(request.json["date"]).date()  # ISO string to date
    startTime = datetime.fromisoformat(request.json["startTime"]).time()
    endTime = datetime.fromisoformat(request.json["endTime"]).time()
    location = request.json["location"]
    description = request.json["description"]
    module = request.json["module"]

    session_exists = StudySession.query.filter_by(name=name).first() is not None

    if session_exists:
        return jsonify({"error": "Session name is used"}), 409

    new_session = StudySession(name=name, admin=user_id, groupSize=groupSize, date=date, startTime=startTime, endTime=endTime, location=location, description=description, module=module)
    db.session.add(new_session)
    db.session.commit()

    latest_session = StudySession.query.filter_by(admin=user_id).order_by(StudySession.studySessionID.desc()).first()
    print("latest session", latest_session)

    new_part = Participation(studentID=user_id, studySessionID=latest_session.studySessionID)
    db.session.add(new_part)
    db.session.commit()

    return jsonify({
        "id": new_session.studySessionID
    })

# get profile
@app.route("/get-profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    user = Profile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "name": user.name,
        "email": user.email,
        "course": user.course,
        "year": user.year,
        "gender": user.gender,
        "tele": user.tele
    })

@app.route("/getGrpParticipants", methods=["POST"])
def getGrpParticipants():
    user_id = session.get("user_id")
    user = Profile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    groupID = request.json["groupId"]
    participants = db.session.query(Profile).join(Participation).\
        filter(Participation.studySessionID == groupID).all()
    
    results = []
    for p in participants:
        results.append({
            "name": p.name,
            "email": p.email,
            "course": p.course,
            "year": p.year,
            "gender": p.gender,
            "tele": p.tele
        })
    
    return jsonify(results)

# edit user profile
@app.route("/edit-profile", methods=["PUT"])
def edit_profile():
    if "user_id" not in session:
        return jsonify({"error": "User not logged in"}), 401

    user = Profile.query.get(session["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()

    # Optional fields: update only if present in request
    if "course" in data:
        user.course = data["course"]
    if "year" in data:
        user.year = data["year"]
    if "tele" in data:
        user.tele = data["tele"]

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
    
# store reequest to join group
@app.route("/join/<int:studySessionID>/request", methods=["POST"])
def submit_join_request(studySessionID):
    user_id = session.get("user_id")
    user = Profile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if you are the host
    own_one = StudySession.query.filter_by(admin=user_id, studySessionID=studySessionID).first()
    if own_one:
        return jsonify({"error":"Session is created by you"}), 404

    # Check if request already exists
    existing = Request.query.filter_by(studentID=user_id, studySessionID=studySessionID).first()
    if existing:
        return jsonify({"error": "Already requested"}), 400

    # Create a new join request
    join_request = Request(
        studentID=user_id,
        studySessionID=studySessionID,
        status="pending",
        dateTime=datetime.now()
    )

    db.session.add(join_request)
    db.session.commit()

    return jsonify({"message": "Join request submitted successfully"}), 201

# retrieve pending requests for hosts
@app.route("/get_requests", methods=["GET"])
def get_host_requests():
    user_id = session.get("user_id")
    user = Profile.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    requests = (
        db.session.query(Request, Profile, StudySession)
        .join(Profile, Request.studentID == Profile.id)
        .join(StudySession, Request.studySessionID == StudySession.studySessionID)
        .filter(
            StudySession.admin == user_id
        )
        .order_by(Request.dateTime.desc())
        .all()
    )

    result = []
    for req, profile, s in requests:
        result.append({
            "requestID": req.reqID,
            "requester": profile.name,
            "requesterID":profile.id,
            "sessionName": s.name,
            "dateTime": req.dateTime.isoformat(),
            "status": req.status
        })

    return jsonify(result), 200

# respond to requests
@app.route("/respond_request/<int:req_id>", methods=["POST"])
def respond_to_request(req_id):
    data = request.get_json()
    new_status = data.get("status")

    req = Request.query.get(req_id)
    if not req:
        return jsonify({"error": "Request not found"}), 404

    # Update status
    req.status = new_status

    if new_status == "approved":
        participation = Participation(
            studentID=req.studentID,
            studySessionID=req.studySessionID
        )
        db.session.add(participation)

    db.session.commit()
    return jsonify({"message": f"Request {new_status}"}), 200

# fetch joined groups
@app.route('/joined-groups', methods=['GET'])
def get_joined_groups():
    user = session.get("user_id")
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    # Find participations
    participations = Participation.query.filter_by(user_id=user.id).all()
    
    # Extract sessions
    joined_sessions = [p.session for p in participations]

    # Return data
    return jsonify([{
        "id": session.id,
        "name": session.name
    } for session in joined_sessions])

if __name__ == "__main__":
    app.run(debug=True)