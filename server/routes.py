from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, UserTree, Tree, AIInsight
from datetime import datetime
import json, re, requests, os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

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

HF_API_KEY = os.getenv("HF_API_KEY")
hf_client = InferenceClient(token=HF_API_KEY)

@tree_bp.route("/api/tree-suggestions", methods=["POST"])
def tree_suggestions():
    """
    Get tree suggestions or tree info using Hugging Face Chat API.
    - If `region` is provided: suggest 3–5 trees for that region.
    - If `tree_name` is provided: return info about that specific tree.
    """

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    region = data.get("region")
    tree_name = data.get("tree_name")

    if not region and not tree_name:
        return jsonify({"error": "Please provide either 'region' or 'tree_name'."}), 400

    # Prompt builder
    if region:
        prompt = f"""
        Suggest 3 to 5 tree species suitable for the region: {region}.
        For each, return a JSON array of objects with:
        - species_name
        - scientific_name
        - avg_co2_absorption (in kg per year)
        - description
        - suitable_regions
        - sunlight_requirement
        - water_needs
        - drought_resistant (true/false)
        - growth_rate
        - mature_height_meters
        Respond strictly as JSON.
        """
    else:
        prompt = f"""
        Provide full details for the tree '{tree_name}'.
        Respond in JSON format with these fields:
        - species_name
        - scientific_name
        - avg_co2_absorption (in kg per year)
        - description
        - suitable_regions
        - sunlight_requirement
        - water_needs
        - drought_resistant (true/false)
        - growth_rate
        - mature_height_meters
        """

    try:
        # Make the serverless chat completion request
        completion = hf_client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3-0324",  # Free serverless model
            messages=[
                {"role": "system", "content": "You are a helpful forestry assistant that outputs only JSON."},
                {"role": "user", "content": prompt}
            ]
        )

        output_text = completion.choices[0].message.content

        # Safely parse JSON from model output
        try:
            parsed = json.loads(output_text)
        except json.JSONDecodeError:
            match = re.search(r"(\[.*\]|\{.*\})", output_text, re.DOTALL)
            parsed = json.loads(match.group()) if match else {"raw_output": output_text}

        return jsonify(parsed)

    except Exception as e:
        print("LLM Error:", e)
        return jsonify({"error": str(e)}), 500

@tree_bp.route("/api/adopt-tree", methods=["POST"])
@jwt_required()
def adopt_tree():
    """
    Adopt a tree: create Tree and UserTree record.
    """
    from models import User  # Import here if not at top
    
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data or "tree" not in data:
        return jsonify({"error": "Missing tree data"}), 400

    tree_data = data["tree"]
    
    print("=" * 50)
    print("RECEIVED TREE DATA:")
    print(f"Raw data: {tree_data}")
    print(f"species_name: {tree_data.get('species_name')} (type: {type(tree_data.get('species_name'))})")
    print(f"avg_co2_absorption: {tree_data.get('avg_co2_absorption')} (type: {type(tree_data.get('avg_co2_absorption'))})")
    print("=" * 50)

    # Validate species_name exists and is not empty
    if not tree_data.get("species_name"):
        return jsonify({"error": "species_name is required and cannot be empty"}), 422

    # Safely parse avg_co2_absorption
    try:
        co2_value = tree_data.get("avg_co2_absorption")
        if co2_value is None or co2_value == "":
            return jsonify({"error": "avg_co2_absorption is required"}), 422
        
        # Clean and convert to float (handles "12 kg/year", "12kg", "12", etc.)
        if isinstance(co2_value, str):
            import re
            co2_value = re.sub(r'[^\d.-]', '', co2_value)  # Keep only digits, dots, minus
        
        avg_co2 = float(co2_value)
        
        if avg_co2 < 0:
            return jsonify({"error": "avg_co2_absorption must be non-negative"}), 422
            
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid avg_co2_absorption value: {str(e)}"}), 422

    # Safely parse mature_height_meters
    try:
        height_value = tree_data.get("mature_height_meters")
        if height_value is not None and height_value != "":
            if isinstance(height_value, str):
                import re
                height_value = re.sub(r'[^\d.-]', '', height_value)  # Keep only digits, dots, minus
            mature_height = float(height_value) if height_value else None
        else:
            mature_height = None
    except (ValueError, TypeError):
        mature_height = None

    # Check if tree already exists
    tree = Tree.query.filter_by(species_name=tree_data["species_name"]).first()
    if not tree:
        tree = Tree(
            species_name=tree_data["species_name"],
            scientific_name=tree_data.get("scientific_name", ""),
            avg_co2_absorption=avg_co2,
            water_needs=tree_data.get("water_needs", "Unknown"),
            growth_rate=tree_data.get("growth_rate", "Unknown"),
            mature_height_meters=mature_height,
            sunlight_requirement=tree_data.get("sunlight_requirement", "Unknown"),
            drought_resistant=bool(tree_data.get("drought_resistant", False))
        )
        db.session.add(tree)
        db.session.commit()

    # Create UserTree adoption record
    user_tree = UserTree(
        user_id=current_user_id,
        tree_id=tree.id,
        status="pending_confirmation",
        growth_stage="pending",
        location=user.region or "Unknown",
        date_adopted=datetime.utcnow(),
        date_planted=None
    )
    db.session.add(user_tree)
    db.session.commit()

    return jsonify({
        "message": f"Tree '{tree.species_name}' successfully adopted!",
        "user_tree_id": user_tree.id,
        "tree_id": tree.id,
        "status": user_tree.status,
        "growth_stage": user_tree.growth_stage,
        "location": user_tree.location,
        "date_adopted": user_tree.date_adopted.isoformat()
    }), 201

@tree_bp.route("/api/trees/<int:tree_id>/confirm", methods=["PUT"])
@jwt_required()
def confirm_tree_planting(tree_id):
    """
    Confirm that a tree has been planted by updating its UserTree record.
    """
    current_user_id = get_jwt_identity()
    user_tree = UserTree.query.filter_by(id=tree_id, user_id=current_user_id).first()

    if not user_tree:
        return jsonify({"error": "Tree not found or unauthorized"}), 404

    user_tree.status = "confirmed"
    user_tree.growth_stage = "seedling"
    user_tree.date_planted = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Tree planting confirmed successfully",
        "id": user_tree.id,
        "status": user_tree.status,
        "growth_stage": user_tree.growth_stage,
        "date_planted": user_tree.date_planted.isoformat()
    }), 200


@tree_bp.route("/api/trees/<int:tree_id>", methods=["DELETE"])
@jwt_required()
def delete_user_tree(tree_id):
    """
    Delete a user's adopted tree from UserTree model.
    """
    current_user_id = get_jwt_identity()
    user_tree = UserTree.query.filter_by(id=tree_id, user_id=current_user_id).first()

    if not user_tree:
        return jsonify({"error": "Tree not found or unauthorized"}), 404

    db.session.delete(user_tree)
    db.session.commit()

    return jsonify({"message": f"Tree {tree_id} deleted successfully"}), 200
