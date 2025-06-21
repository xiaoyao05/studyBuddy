from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
from config import ApplicationConfig
from models import db, Profile, StudySession, Request, Participation
from datetime import datetime

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
    print("user_id", user_id)

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
    
    sessions = StudySession.query.all()
    result = []
    for s in sessions:
        result.append({
            "sessionID": s.studySessionID,
            "admin": s.admin,
            "name": s.name,
            "groupSize": s.groupSize,
            "module": s.module,
            "date": s.date.isoformat(),         # Convert to "YYYY-MM-DD"
            "startTime": s.startTime.strftime("%H:%M"),  # e.g., "14:30"
            "endTime": s.endTime.strftime("%H:%M"),
            "location": s.location,
            "description": s.description
        })

    return jsonify(result)

# # edit user profile
# @app.route("/edit-profile", methods=["PUT"])
# def edit_profile():
#     if "user_id" not in session:
#         return jsonify({"error": "User not logged in"}), 401

#     user = Profile.query.get(session["user_id"])
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     data = request.get_json()

#     # Optional fields: update only if present in request
#     if "Name" in data:
#         user.name = data["Name"]
#     if "Course" in data:
#         user.course = data["Course"]
#     if "Year" in data:
#         user.year = data["Year"]
#     if "Gender" in data:
#         user.gender = data["Gender"]
#     if "Telegram Handle" in data:
#         user.tele = data["Telegram Handle"]

#     try:
#         db.session.commit()
#         return jsonify({
#             "message": "Profile updated successfully",
#             "name": user.name,
#             "course": user.course,
#             "year": user.year,
#             "gender": user.gender,
#             "tele": user.tele
#         })
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 500

# # create new session
# @app.route("/create-session", methods=["POST"])
# def create_session():
#     name = request.json["Group Name"]
#     groupSize = request.json["Maximum Participants"]
#     date = request.json["Date"]
#     startTime = request.json["Start Time"]
#     endTime = request.json["End Time"]
#     location = request.json["Location"]
#     description = request.json["Description"]
#     module = request.json["Module (optional)"]

#     session_exists = StudySession.query.filter_by(name=name).first() is not None

#     if session_exists:
#         return jsonify({"error": "Session name is used"}), 409

#     new_session = StudySession(name=name, groupSize=groupSize, date=date, startTime=startTime, endTime=endTime, location=location, description=description, module=module)
#     db.session.add(new_session)
#     db.session.commit()

#     return jsonify({
#         "id": new_session.id
#     })

# # store reequest to join group
# @app.route("/join/<int:studySessionID>/request", methods=["POST"])
# def submit_join_request(session_id):
#     data = request.get_json()
#     student_id = data.get('currentUserID')

#     existing = Request.query.filter_by(studentID = student_id, studySessionID = session_id).first()
#     if existing:
#         return jsonify({"error":"Already requested"}), 400
    
#     join_request = Request(studentID = student_id, studySessionID = session_id, status = "pending", dateTime = datetime.utcnow())
#     db.session.add(join_request)
#     db.session.commit

# # retrieve requests for hosts
# @app.route("/get/<host_id>/requests", methods=["GET"])
# def get_host_requests(host_id):
#     requests = (
#         db.session.query(Request, Profile)
#         .join(StudySession, Profile)
#         .filter(StudySession.admin == host_id, Request.reqID == Profile.id)
#         .order_by(Request.dateTime.desc())
#         .all()
#     )
#     result = []
#     for req in requests:
#         result.append (
#             {
#                 "requestID": req.reqID,
#                 "requester": req.student.name,
#                 "sessionName": req.study_session.name,
#                 "dateTime": req.dateTime.isoformat(),
#                 "status": req.status
#             }
#         )

#     return jsonify(result), 200

# # respond to requests
# @app.route("/respond/<int:req_id>/request", methods=["POST"])
# def respond_to_request(req_id):
#     data = request.get_json()
#     new_status = data.get("status")

#     req = Request.query.get(req_id)
#     if not req:
#         return jsonify({"error":"request not found"}, 404)
    
#     req.status = new_status

#     if req.status == 'approved':
#         # Add user to Participation table
#         already_joined = Participation.query.filter_by(
#             studentID=req.studentID,
#             studySessionID=req.studySessionID
#         ).first()

#         if not already_joined:
#             db.session.add(Participation(
#                 studentID=req.studentID,
#                 studySessionID=req.studySessionID
#             ))

#     db.session.commit()
#     return jsonify({"message": f"Request {req.status}"}), 200

if __name__ == "__main__":
    app.run(debug=True)