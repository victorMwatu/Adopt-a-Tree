from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from datetime import timedelta
from models import db, User
from flask_bcrypt import Bcrypt
import secrets  
from flask_mail import Message  
bcrypt = Bcrypt()

def create_auth_blueprint(mail):
    """Create auth blueprint with mail instance"""
    auth_bp = Blueprint("auth", __name__)

    @auth_bp.route("/signup", methods=["POST", "OPTIONS"])
    def signup():
        if request.method == "OPTIONS":
            return '', 204
        
        try:
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

            token = create_access_token(identity=user.id, expires_delta=timedelta(hours=24))
            return jsonify({
                "message": "User created successfully",
                "token": token,
                "user": {"id": user.id, "name": user.name, "region": user.region, "email": user.email}
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"Error in signup: {str(e)}") 
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
        
        except Exception as e:
            print(f"Error in login: {str(e)}")
            return jsonify({"message": "An error occurred during login", "error": str(e)}), 500

    @auth_bp.route("/forgotpassword", methods=["POST", "OPTIONS"])
    def forgot_password():
        if request.method == "OPTIONS":
            return '', 204
        
        print("=== FORGOT PASSWORD REQUEST RECEIVED ===")

        try:
            data = request.get_json()
            email = data.get("email")
            print(f"Email received: {email}") 
            
            if not email:
                return jsonify({"message": "Email is required"}), 400
            
            user = User.query.filter_by(email=email).first()
            print(f"User found: {user}")
            
            if not user:
                return jsonify({"message": "If email exists, reset link will be sent"}), 200
            
            token = secrets.token_urlsafe(32)
            user.set_reset_token(token)
            db.session.commit()
            print(f"Token generated: {token}") 
            
            reset_link = f"http://localhost:3000/auth/resetpassword?token={token}"
            
            try:
                msg = Message(
                    subject="Password Reset Request",
                    recipients=[user.email],
                    body=f"Click this link to reset your password: {reset_link}\n\nThis link expires in 1 hour."
                )
                mail.send(msg)
                print("Email sent successfully!")
            except Exception as e:
                print(f"\n=== PASSWORD RESET EMAIL ===")
                print(f"To: {user.email}")
                print(f"Reset Link: {reset_link}")
                print(f"========================\n")
                print(f"Email sending failed: {str(e)}") 
            
            return jsonify({"message": "If email exists, reset link will be sent"}), 200
            
        except Exception as e:
            print(f"Error in forgot-password: {str(e)}")
            return jsonify({"message": "An error occurred"}), 500

    @auth_bp.route("/resetpassword", methods=["POST", "OPTIONS"])
    def reset_password():
        if request.method == "OPTIONS":
            return '', 204
        
        try:
            data = request.get_json()
            token = data.get("token")
            new_password = data.get("password")
            
            if not token or not new_password:
                return jsonify({"message": "Token and new password are required"}), 400
            
            user = User.query.filter_by(reset_token=token).first()
            
            if not user or not user.check_reset_token(token):
                return jsonify({"message": "Invalid or expired reset token"}), 400
            
            user.set_password(new_password)
            user.reset_token = None
            user.reset_token_expiry = None
            db.session.commit()
            
            return jsonify({"message": "Password reset successfully"}), 200
            
        except Exception as e:
            print(f"Error in reset-password: {str(e)}")
            return jsonify({"message": "An error occurred"}), 500
    
    return auth_bp