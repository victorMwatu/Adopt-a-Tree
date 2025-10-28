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