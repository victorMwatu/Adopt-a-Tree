from datetime import datetime, timedelta
from app import app, db          
from models import User, Tree, UserTree
from flask_jwt_extended import create_access_token

with app.app_context():
    print("Seeding...")

    db.drop_all()
    db.create_all()

    # Create User
    user = User(name="group6", email="test@example.com", region="Nairobi")
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()

    # Create Trees with full details
    acacia = Tree(
        species_name="Acacia",
        scientific_name="Acacia tortilis",
        avg_co2_absorption=22.5,
        description="Hardy drought-resistant tree perfect for arid regions",
        suitable_regions=["Nairobi", "Nakuru", "Kajiado"],
        sunlight_requirement="Full sun",
        water_needs="Low water",
        drought_resistant=True,
        growth_rate="Fast growing",
        mature_height_meters=15.0
    )

    cedar = Tree(
        species_name="Cedar",
        scientific_name="Cedrus deodara",
        avg_co2_absorption=18.0,
        description="Evergreen coniferous tree with excellent carbon absorption",
        suitable_regions=["Nairobi", "Nakuru", "Nyeri"],
        sunlight_requirement="Full sun",
        water_needs="Medium water",
        drought_resistant=False,
        growth_rate="Slow growing",
        mature_height_meters=30.0
    )

    olive = Tree(
        species_name="Olive",
        scientific_name="Olea europaea",
        avg_co2_absorption=15.5,
        description="Mediterranean fruit tree adapted to various climates",
        suitable_regions=["Nairobi", "Nakuru", "Kiambu"],
        sunlight_requirement="Full sun",
        water_needs="Medium water",
        drought_resistant=True,
        growth_rate="Slow growing",
        mature_height_meters=8.0
    )

    db.session.add(acacia)
    db.session.add(cedar)
    db.session.add(olive)
    db.session.commit()

    # Create sample adoption
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

    # Generate JWT token
    token = create_access_token(identity=user.id)
    
    print("Seed complete")
    print("\n Database Summary:")
    print(f"   Users: {User.query.count()}")
    print(f"   Trees: {Tree.query.count()}")
    print(f"   Adoptions: {UserTree.query.count()}")
    print("\n Use this token in Authorization header:")
    print(f"   Bearer {token}")
    print("\n Test Login:")
    print(f"   Email: test@example.com")
    print(f"   Password: password123")