from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserTree, Tree, AIInsight
from datetime import datetime
from flask import request
from models import AIInsight
from sqlalchemy import cast, String


tree_bp = Blueprint("tree_bp", __name__)

@tree_bp.route("/api/trees/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_trees(user_id):
    """
    Returns all trees belonging to the given user_id.
    Protected by JWT; only the logged-in user can access their trees.
    Automatically updates growth_stage before returning.
    """
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 403

    user_trees = UserTree.query.filter_by(user_id=user_id).all()
    updated_trees = []

    for user_tree in user_trees:
        old_stage = user_tree.growth_stage
        user_tree.update_growth_stage()
        if user_tree.growth_stage != old_stage:
            db.session.add(user_tree)
        db.session.commit()

        age_days = user_tree.get_tree_age_days()
        progress = min(round((age_days / 1095) * 100, 1), 100)  

        if user_tree.growth_stage.lower() == "seedling":
            icon = "🌱"
        elif user_tree.growth_stage.lower() in ["young", "young tree"]:
            icon = "🌿"
        else:
            icon = "🌳"

        updated_trees.append({
            "id": user_tree.id,
            "name": user_tree.tree.species_name,
            "growth_stage": user_tree.growth_stage.capitalize(),
            "icon": icon,
            "progress": progress,
            "age": age_days,
            "status": user_tree.status,
        })

    return jsonify(updated_trees)


@tree_bp.route("/api/trees/available", methods=["GET"])
def get_available_trees():
    """
    Get all available trees for adoption with optional region filtering
    """
    region = request.args.get('region')
    
    if region:
        # For PostgreSQL JSON, use proper JSON operators
        from sqlalchemy import cast, String
        trees = Tree.query.filter(
            cast(Tree.suitable_regions, String).like(f'%{region}%')
        ).all()
    else:
        trees = Tree.query.all()
    
    return jsonify([{
        "id": tree.id,
        "name": tree.species_name,
        "scientific_name": tree.scientific_name,
        "description": tree.description,
        "habitat": tree.suitable_regions[0] if tree.suitable_regions else "Various",
        "growth_rate": tree.growth_rate or "Medium growing",
        "water_needs": tree.water_needs or "Medium water",
        "co2_absorption": tree.avg_co2_absorption,
        "sunlight": tree.sunlight_requirement,
        "drought_resistant": tree.drought_resistant
    } for tree in trees])

@tree_bp.route("/api/trees/adopt", methods=["POST"])
@jwt_required()
def adopt_tree():
    """
    Adopt a tree for the current user
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    tree_id = data.get('tree_id')
    location = data.get('location', 'Nairobi, Kenya')
    
    if not tree_id:
        return jsonify({"message": "tree_id is required"}), 400
    
    # Check if tree exists
    tree = Tree.query.get(tree_id)
    if not tree:
        return jsonify({"message": "Tree not found"}), 404
    
    # Create adoption
    user_tree = UserTree(
        user_id=current_user_id,
        tree_id=tree_id,
        location=location,
        growth_stage='seedling',
        status='pending_confirmation'
    )
    
    db.session.add(user_tree)
    db.session.commit()
    
    return jsonify({
        "message": "Tree adopted successfully!",
        "adoption_id": user_tree.id,
        "tree_name": tree.species_name
    }), 201


@tree_bp.route("/api/trees/suggest", methods=["POST"])
@jwt_required()
def suggest_tree():
    """
    Allow users to suggest a tree not in the database
    You can store this in a separate TreeSuggestion table or use AIInsight
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    tree_name = data.get('tree_name')
    description = data.get('description', '')
    
    if not tree_name:
        return jsonify({"message": "tree_name is required"}), 400
    
    
    suggestion = AIInsight(
        user_id=current_user_id,
        message=f"Tree Suggestion: {tree_name}. Description: {description}",
        insight_type='tree_suggestion'
    )
    
    db.session.add(suggestion)
    db.session.commit()
    
    return jsonify({"message": "Tree suggestion submitted successfully!"}), 201