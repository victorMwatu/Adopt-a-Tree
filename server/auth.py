from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from models import db, User
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    data = request.get_json() or {}
    name = data.get("name")
    region = data.get("region")
    email = data.get("email")
    password = data.get("password")

    if not name or not region or not email or not password:
        return jsonify({"message": "Name, Email, and Password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already used to register an account"}), 400

    user = User(name=name, region=region, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error in signup: {str(e)}")  # Log the error
        return jsonify({"message": "An error occurred during signup", "error": str(e)}), 500

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id, expires_delta=timedelta(hours=24))
    return jsonify({
        "token": token,
        "user": {"id": user.id, "name": user.name, "region": user.region, "email": user.email}
    }), 200