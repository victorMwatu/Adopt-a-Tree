import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('fletchermichaelvictor', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://adoptatree_db_user:JyGm81b3rQFpkS3VGfb9gbsZemmBdIgj@dpg-d40t8pn5r7bs7387jde0-a/adoptatree_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('fletchermichaelvictor', 'jwt-secret-key')
