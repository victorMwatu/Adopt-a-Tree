from flask import Flask
from flask_cors import CORS
from config import Config
from flask_migrate import Migrate
from models import db, bcrypt
from flask_jwt_extended import JWTManager
from auth import auth_bp
from dashboard import dashboard_bp # <-- dashboard(Fletcher)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)
bcrypt.init_app(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")# <-- register dashboard(Fletcher)

@app.route('/')
def home():
    return {'message': 'Adopt a Tree API'}

if __name__ == '__main__':
    app.run(debug=True)