from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import enum
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
class TreeStatus(enum.Enum):
    PICKED = "picked"
    PLANTED = "planted"
    DELETED = "deleted"

class Tree(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(100))
    carbon_offset_per_year = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    adopters = db.relationship("UserTree", back_populates="tree")

class UserTree(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    tree_id = db.Column(db.Integer, db.ForeignKey("tree.id"), nullable=True)
    custom_name = db.Column(db.String(100))
    adopted_at = db.Column(db.DateTime, default=datetime.utcnow)
    planted_at = db.Column(db.DateTime)
    status = db.Column(db.Enum(TreeStatus), default=TreeStatus.PICKED)

    user = db.relationship("User", backref="trees")
    tree = db.relationship("Tree", back_populates="adopters")   
