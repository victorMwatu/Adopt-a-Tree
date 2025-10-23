from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Tree, UserTree, TreeStatus
from datetime import datetime, date

dashboard_bp = Blueprint("dashboard", __name__)

# ----- Get all trees for a user -----
@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    user_trees = UserTree.query.filter(
        UserTree.user_id == user_id,
        UserTree.status != TreeStatus.DELETED
    ).all()

    results = []
    for ut in user_trees:
        days_since = None
        total_offset = None
        if ut.planted_at:
            days_since = (date.today() - ut.planted_at.date()).days
            years_fraction = days_since / 365
            total_offset = (ut.tree.carbon_offset_per_year if ut.tree else 0) * years_fraction

        results.append({
            "id": ut.id,
            "tree_name": ut.tree.name if ut.tree else ut.custom_name,
            "species": ut.tree.species if ut.tree else None,
            "custom_name": ut.custom_name,
            "status": ut.status.value,
            "adopted_at": ut.adopted_at.isoformat(),
            "planted_at": ut.planted_at.isoformat() if ut.planted_at else None,
            "carbon_offset_per_year": ut.tree.carbon_offset_per_year if ut.tree else 0,
            "days_since_planted": days_since,
            "total_carbon_offset": round(total_offset, 2) if total_offset else 0
        })

    return jsonify(results), 200

# ----- Plant a tree -----
@dashboard_bp.route("/dashboard/plant/<int:user_tree_id>", methods=["PUT"])
@jwt_required()
def plant_tree(user_tree_id):
    user_id = get_jwt_identity()
    ut = UserTree.query.filter_by(id=user_tree_id, user_id=user_id).first()
    if not ut:
        return jsonify({"message": "Tree not found"}), 404
    ut.planted_at = datetime.utcnow()
    ut.status = TreeStatus.PLANTED
    db.session.commit()
    return jsonify({"message": "Tree planted successfully"}), 200

# ----- Delete a tree -----
@dashboard_bp.route("/dashboard/delete/<int:user_tree_id>", methods=["DELETE"])
@jwt_required()
def delete_tree(user_tree_id):
    user_id = get_jwt_identity()
    ut = UserTree.query.filter_by(id=user_tree_id, user_id=user_id).first()
    if not ut:
        return jsonify({"message": "Tree not found"}), 404
    ut.status = TreeStatus.DELETED
    db.session.commit()
    return jsonify({"message": "Tree deleted successfully"}), 200
