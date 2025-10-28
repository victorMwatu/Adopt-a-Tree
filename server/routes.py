from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserTree, Tree, AIInsight
from datetime import datetime
from sqlalchemy import cast, String
import openai
import json
import os

tree_bp = Blueprint("tree_bp", __name__)

# ================================================================
# AI API KEY
# ================================================================
openai.api_key = os.environ.get("OPENAI_API_KEY")  # Ensure this is set in your environment

# ================================================================
# Fetch user trees
# ================================================================
@tree_bp.route("/api/trees/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user_trees(user_id):
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
            "location": user_tree.location,
            "nickname": getattr(user_tree, "nickname", None)
        })

    return jsonify(updated_trees)


# ================================================================
# Get available trees
# ================================================================
@tree_bp.route("/api/trees/available", methods=["GET"])
def get_available_trees():
    region = request.args.get("region")

    if region:
        trees = Tree.query.filter(
            cast(Tree.suitable_regions, String).like(f"%{region}%")
        ).all()
    else:
        trees = Tree.query.all()

    return jsonify([
        {
            "id": tree.id,
            "name": tree.species_name,
            "scientific_name": tree.scientific_name,
            "description": tree.description,
            "habitat": tree.suitable_regions[0] if tree.suitable_regions else "Various",
            "growth_rate": tree.growth_rate or "Medium growing",
            "water_needs": tree.water_needs or "Medium water",
            "co2_absorption": tree.avg_co2_absorption,
            "sunlight": tree.sunlight_requirement,
            "drought_resistant": tree.drought_resistant,
        }
        for tree in trees
    ])


# ================================================================
# Adopt a tree
# ================================================================
@tree_bp.route("/api/trees/adopt", methods=["POST"])
@jwt_required()
def adopt_tree():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    tree_id = data.get("tree_id")
    location = data.get("location", "Nairobi, Kenya")

    if not tree_id:
        return jsonify({"message": "tree_id is required"}), 400

    tree = Tree.query.get(tree_id)
    if not tree:
        return jsonify({"message": "Tree not found"}), 404

    user_tree = UserTree(
        user_id=current_user_id,
        tree_id=tree_id,
        location=location,
        growth_stage="seedling",
        status="pending_confirmation",
        planted_at=None
    )

    db.session.add(user_tree)
    db.session.commit()

    return jsonify({
        "message": "Tree adopted successfully!",
        "adoption_id": user_tree.id,
        "tree_name": tree.species_name,
    }), 201


# ================================================================
# Suggest a new tree
# ================================================================
@tree_bp.route("/api/trees/suggest", methods=["POST"])
@jwt_required()
def suggest_tree():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    tree_name = data.get("tree_name")
    description = data.get("description", "")

    if not tree_name:
        return jsonify({"message": "tree_name is required"}), 400

    suggestion = AIInsight(
        user_id=current_user_id,
        message=f"Tree Suggestion: {tree_name}. Description: {description}",
        insight_type="tree_suggestion",
    )

    db.session.add(suggestion)
    db.session.commit()

    return jsonify({"message": "Tree suggestion submitted successfully!"}), 201


# ================================================================
# Confirm planting
# ================================================================
@tree_bp.route("/api/trees/<int:tree_id>/confirm", methods=["PATCH"])
@jwt_required()
def confirm_tree(tree_id):
    current_user_id = get_jwt_identity()
    user_tree = UserTree.query.get(tree_id)

    if not user_tree:
        return jsonify({"message": "Tree not found"}), 404
    if user_tree.user_id != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403
    if user_tree.status == "active":
        return jsonify({"message": "Tree already confirmed"}), 400

    user_tree.status = "active"
    user_tree.planted_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Tree confirmed successfully!"}), 200


# ================================================================
# Delete tree
# ================================================================
@tree_bp.route("/api/trees/<int:tree_id>", methods=["DELETE"])
@jwt_required()
def delete_tree(tree_id):
    current_user_id = get_jwt_identity()
    user_tree = UserTree.query.get(tree_id)

    if not user_tree:
        return jsonify({"message": "Tree not found"}), 404
    if user_tree.user_id != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(user_tree)
    db.session.commit()

    return jsonify({"message": "Tree deleted successfully!"}), 200


# ================================================================
# Edit tree details
# ================================================================
@tree_bp.route("/api/trees/<int:tree_id>", methods=["PATCH"])
@jwt_required()
def edit_tree(tree_id):
    current_user_id = get_jwt_identity()
    user_tree = UserTree.query.get(tree_id)

    if not user_tree:
        return jsonify({"message": "Tree not found"}), 404
    if user_tree.user_id != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    if "location" in data:
        user_tree.location = data["location"]
    if "nickname" in data:
        user_tree.nickname = data["nickname"]

    db.session.commit()

    return jsonify({"message": "Tree updated successfully!"}), 200


# ================================================================
# AI-based tree recommendations (for frontend "Select Your Tree")
# ================================================================
@tree_bp.route("/api/trees/ai-recommend", methods=["GET"])
@jwt_required()
def get_ai_recommendations():
    """
    Returns up to 5 AI-recommended trees for a region or custom tree.
    """
    current_user_id = get_jwt_identity()
    region = request.args.get("region")
    custom_tree = request.args.get("custom_tree")

    if not region and not custom_tree:
        return jsonify([])

    prompt = ""
    if custom_tree:
        prompt = (
            f"Suggest up to 5 trees similar to '{custom_tree}' "
            "that can be planted in Kenya. Include species_name, growth_rate, water_needs, "
            "avg_co2_absorption, icon."
        )
    else:
        prompt = (
            f"Suggest up to 5 trees suitable for planting in {region}, Kenya. "
            "Include species_name, growth_rate, water_needs, avg_co2_absorption, icon."
        )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.7
        )

        ai_text = response.choices[0].message.content.strip()
        # Ensure AI returns valid JSON array
        recommended_trees = json.loads(ai_text)

        # Log AI request
        insight = AIInsight(
            user_id=current_user_id,
            message=f"AI recommendation request: region={region}, custom_tree={custom_tree}",
            insight_type="recommendation"
        )
        db.session.add(insight)
        db.session.commit()

        return jsonify(recommended_trees)

    except Exception as e:
        print("AI Recommendation Error:", e)
        return jsonify([])
