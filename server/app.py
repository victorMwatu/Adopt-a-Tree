from flask import Flask
from flask_cors import CORS
from config import Config
from flask_migrate import Migrate
from models import db, bcrypt
from flask_jwt_extended import JWTManager
from auth import auth_bp
from routes import tree_bp


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"]
    }
})
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(tree_bp)

@app.route('/')
def home():
    return {'message': 'Adopt a Tree API'}

if __name__ == '__main__':
    app.run(debug=True)