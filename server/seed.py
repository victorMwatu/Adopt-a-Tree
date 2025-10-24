from datetime import datetime, timedelta
from app import app, db          
from models import User, Tree, UserTree

from flask_jwt_extended import create_access_token

with app.app_context():
    print("Seeding...")

    db.drop_all()
    db.create_all()

    user = User(name="group6", email="test@example.com", region="Nairobi")
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()

    acacia = Tree(
        species_name="Acacia",
        scientific_name="Acacia tortilis",
        avg_co2_absorption=22.5
    )
    db.session.add(acacia)
    db.session.commit()

    ut = UserTree(
        user_id=user.id,
        tree_id=acacia.id,
        date_adopted=datetime.utcnow() - timedelta(days=20),
        date_planted=datetime.utcnow() - timedelta(days=15),
        location="Nairobi, Kenya",
        growth_stage="seedling",
        status="active"
    )
    db.session.add(ut)
    db.session.commit()

    token = create_access_token(identity=user.id)
    print("✅ Seed complete")
    print("Use this token in Authorization header:")
    print(token)