from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    region = db.Column(db.String(100), nullable=False)


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

class Tree(db.Model):

    
    __tablename__ = 'trees'

     # Primary Key
    id = db.Column(db.integer, primary_key=True)

    # Tree Information
    species_name = db.Column(db.String(100), nullable=False, index=True)
    scientific_name = db.Column(db.String(100), nullable=True)
    avg_co2_absorption = db.Column(db.Float, nullable=False)  
    description = db.Column(db.Text, nullable=True)

    # Climate & Growth Information
    suitable_regions = db.Column(db.JSON, nullable=True)  
    sunlight_requirement = db.Column(db.String(50), nullable=True)  
    water_needs = db.Column(db.String(50), nullable=True)  
    drought_resistant = db.Column(db.Boolean, default=False)
    growth_rate = db.Column(db.String(50), nullable=True)  
    mature_height_meters = db.Column(db.Float, nullable=True)

        # Relationships
    adoptions = db.relationship('UserTree', backref='tree', lazy=True)
    ai_insights = db.relationship('AIInsight', backref='tree', lazy=True)
    
    def __repr__(self):
        return f'<Tree {self.species_name}>'
