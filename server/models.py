from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    region = db.Column(db.String(100), nullable=False)

    profile_image_url = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

     # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trees = db.relationship('UserTree', backref='user', lazy=True, cascade='all, delete-orphan')
    ai_insights = db.relationship('AIInsight', backref='user', lazy=True, cascade='all, delete-orphan')
    


    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def get_total_co2_offset(self):
        """Calculate total CO₂ offset from all adopted trees"""
        return sum(tree.co2_offset for tree in self.trees)
    
    def get_tree_count(self):
        """Get total number of adopted trees"""
        return len(self.trees)
    
    def __repr__(self):
        return f'<User {self.email}>'
