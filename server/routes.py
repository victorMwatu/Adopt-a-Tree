from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserTree
from datetime import datetime

# Create a Blueprint (optional but clean)
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
        progress = min(round((age_days / 1095) * 100, 1), 100)  # example: 3-year growth cycle

        # Choose emoji/icon based on stage
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