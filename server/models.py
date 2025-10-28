from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

db = SQLAlchemy()
bcrypt = Bcrypt()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    region = db.Column(db.String(100), nullable=True)
    reset_token = db.Column(db.String(100), nullable=True, unique=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)

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
        
    def set_reset_token(self, token):
        """Set password reset token with 1-hour expiry"""
        self.reset_token = token
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)

    def check_reset_token(self, token):
        """Verify reset token is valid and not expired"""
        if self.reset_token != token:
            return False
        if datetime.utcnow() > self.reset_token_expiry:
            return False
        return True



class Tree(db.Model):
    __tablename__ = 'trees'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

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


class UserTree(db.Model):
    __tablename__ = 'user_trees'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    tree_id = db.Column(db.Integer, db.ForeignKey('trees.id'), nullable=False, index=True)

    # Adoption Information
    date_adopted = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    date_planted = db.Column(db.DateTime, nullable=True)  # Set when user confirms planting
    location = db.Column(db.String(200), nullable=True)

    # Optional nickname for personalization
    nickname = db.Column(db.String(100), nullable=True)

    # Tree Status & Progress
    co2_offset = db.Column(db.Float, default=0.0)
    growth_stage = db.Column(db.String(50), default='pending')
    status = db.Column(db.String(50), default='pending_confirmation')

    # Relationships
    ai_insights = db.relationship('AIInsight', backref='user_tree', lazy=True)

    def calculate_co2_offset(self):
        """Calculate dynamic CO₂ offset based on tree age"""
        reference_date = self.date_planted or self.date_adopted
        days_alive = (datetime.utcnow() - reference_date).days
        years_alive = days_alive / 365.0
        return self.tree.avg_co2_absorption * years_alive

    def get_tree_age_days(self):
        """Get the age of the tree in days"""
        reference_date = self.date_planted or self.date_adopted
        return (datetime.utcnow() - reference_date).days

    def get_progress_percentage(self):
        """Return growth progress toward 3 years (1095 days)"""
        age_days = self.get_tree_age_days()
        return min(round((age_days / 1095) * 100, 1), 100)

    def update_growth_stage(self):
        """Auto-update growth stage based on tree age"""
        days = self.get_tree_age_days()
        if days < 30:
            self.growth_stage = 'seedling'
        elif days < 365:
            self.growth_stage = 'young'
        else:
            self.growth_stage = 'mature'

    def confirm_planting(self):
        """Mark as planted and start tracking age"""
        self.status = 'active'
        self.date_planted = datetime.utcnow()
        db.session.commit()

    def __repr__(self):
        return f'<UserTree user_id={self.user_id} tree_id={self.tree_id} status={self.status}>'


class AIInsight(db.Model):
    """AIInsight Model - Stores AI-generated recommendations and insights"""
    __tablename__ = 'ai_insights'

    # Primary Key
    id = db.Column(db.Integer, primary_key=True)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    tree_id = db.Column(db.Integer, db.ForeignKey('trees.id'), nullable=True)
    user_tree_id = db.Column(db.Integer, db.ForeignKey('user_trees.id'), nullable=True)

    # Insight Content
    message = db.Column(db.Text, nullable=False)
    insight_type = db.Column(db.String(50), nullable=True)  # recommendation, care_tip, motivation, etc.

    # Metadata
    ai_model_used = db.Column(db.String(50), nullable=True)
    is_read = db.Column(db.Boolean, default=False)

    def mark_as_read(self):
        """Mark insight as read by user"""
        self.is_read = True
        db.session.commit()

    @staticmethod
    def get_user_insights(user_id, limit=5):
        """Fetch recent insights for a user"""
        return (
            AIInsight.query.filter_by(user_id=user_id)
            .order_by(AIInsight.id.desc())
            .limit(limit)
            .all()
        )

    def __repr__(self):
        return f'<AIInsight user_id={self.user_id} type={self.insight_type}>'
