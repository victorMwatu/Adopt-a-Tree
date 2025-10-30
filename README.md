# 🌳 Adopt-a-Tree Platform

## Personalized Tree Adoption & Care System

A full-stack AI-powered web application that empowers individuals and communities to combat climate change by adopting region-appropriate trees and receiving personalized care guidance to ensure high survival rates and sustained environmental impact.

**Live Demo:**
- 🌐 Frontend: [https://adopt-a-tree-murex.vercel.app/](https://adopt-a-tree-murex.vercel.app/)
- ⚙️ Backend API: [https://adopt-a-tree.onrender.com](https://adopt-a-tree.onrender.com)

**Aligned with UN SDG 13: Climate Action** — Strengthening awareness and individual contribution to environmental sustainability.

---

## 👥 Team

- **Michael Fuchaka**
- **Victor Mwatu**
- **Fletcher Kariuki**

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Project Objective](#project-objective)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Challenges Encountered](#challenges-encountered)
- [Future Enhancements](#future-enhancements)
- [Expected Impact](#expected-impact)

---

## 🚨 Problem Statement

1. **Climate Crisis:** Deforestation and declining tree cover are increasing climate vulnerability worldwide
2. **Low Survival Rates:** Many tree-planting initiatives lack long-term care, resulting in poor tree survival rates
3. **Lack of Guidance:** Individuals want to contribute to environmental conservation but lack guidance on which trees to plant and how to care for them properly

---

## 🎯 Project Objective

To enable individuals and communities to adopt region-appropriate trees and receive ongoing, personalized AI-powered guidance to ensure high survival rates and sustained environmental impact.

---

## ✨ Key Features

### 🤖 AI-Powered Recommendations
- Leveraging HuggingFace technology to suggest up to 5 suitable tree species based on user's geographical region
- Climate and growth suitability evaluation
- Detailed tree descriptions and care instructions

### 📊 User Dashboard & Tree Tracking
- Personal dashboard showing total CO₂ offset
- Track all adopted trees and their growth stages
- View tree age, location, and planting dates
- Real-time CO₂ absorption calculations

### 💡 Personalized Weekly Care Insights
- AI-generated care tips tailored to each adopted tree
- Growth stage-specific recommendations
- Sustainability motivation messages

### 🏆 Leaderboard & Gamification
- Community engagement through competitive rankings
- Users ranked by CO₂ offset or number of trees adopted
- Shareable achievement links

### 🌱 Multi-Tree Adoption Support
- Adopt multiple trees simultaneously
- Track each tree's individual progress
- Manage all adoptions from a single dashboard

---

## 🔄 How It Works

1. **User Registration:** Create an account and specify your geographical location
2. **AI Recommendation:** The system evaluates local climate conditions and recommends up to 5 suitable tree species
3. **Tree Adoption:** Choose and adopt one or more recommended trees
4. **Care Tracking:** Receive weekly AI-generated care insights specific to each adopted tree
5. **Community Engagement:** View your ranking on the leaderboard and compare your environmental impact with others

---

## 🛠️ Technologies Used

### Frontend
- **Framework:** React with Next.js
- **Styling:** TailwindCSS
- **State Management:** Context API
- **Routing:** Next.js App Router
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Framework:** Flask (Python)
- **ORM:** SQLAlchemy
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Flask-Bcrypt
- **API Documentation:** Swagger
- **Deployment:** Render

### AI Integration
- **Platform:** HuggingFace
- **Use Cases:** 
  - Tree species recommendations
  - Care tips generation
  - Sustainability insights

### Database
- **Production:** PostgreSQL (Render)
- **Features:** Relational data with proper indexing and cascade deletion

---

## 📁 Project Structure

### Frontend Structure
```
src/
├── app/
│   ├── adopt/              # Tree adoption page
│   ├── auth/               # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgotpassword/
│   │   └── resetpassword/
│   ├── dashboard/          # User dashboard
│   ├── leaderboard/        # Community leaderboard
│   ├── profile/            # User profile management
│   ├── layout.js           # Root layout
│   └── page.js             # Landing page
├── components/
│   └── layout/             # Reusable layout components
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       ├── Sidebar.jsx
│       └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── lib/
│   └── api.js              # API integration layer
└── utils/
    └── helpers.js          # Utility functions
```

### Backend Structure
```
backend/
├── app.py                  # Flask application entry point
├── models.py               # SQLAlchemy database models
├── routes.py               # API route definitions
├── auth.py                 # Authentication logic
├── ai_service.py           # AI integration service
├── config.py               # Configuration management
├── seed.py                 # Database seeding script
├── migrations/             # Database migrations
└── requirements.txt        # Python dependencies
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v14 or higher)
- **Git**

### Frontend Setup

```bash
# Clone the repository
git clone <repository-url>
cd adopt-a-tree/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
# Add your backend API URL to .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd adopt-a-tree/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Configure environment variables in .env
DATABASE_URL=postgresql://user:password@localhost:5432/adopt_a_tree
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Initialize database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed the database (optional)
python seed.py

# Run development server
flask run
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |

### Tree Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/trees?page=n` | Get paginated tree list | Yes |
| POST | `/api/trees/adopt` | Adopt a tree | Yes |
| PATCH | `/api/trees/:id` | Update tree details | Yes |
| DELETE | `/api/trees/:id` | Delete adopted tree | Yes |
| GET | `/api/trees/:id` | Get specific tree details | Yes |

### AI Integration Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/recommend` | Get AI tree recommendations | Yes |
| GET | `/api/ai/insights` | Get user's AI insights | Yes |

### Leaderboard & Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leaderboard` | Get top users by CO₂ offset | Yes |
| GET | `/api/dashboard/stats` | Get user statistics | Yes |

### Interactive API Documentation
Visit `/api/docs` when running the backend server to access the Swagger UI documentation.

---

## 🗄️ Database Schema

### User Model
- `id` (Primary Key)
- `name` - User's full name
- `email` - Unique email address (indexed)
- `password_hash` - Bcrypt hashed password
- `region` - Geographic location
- `reset_token` - Password reset token
- `reset_token_expiry` - Token expiration timestamp
- `created_at`, `updated_at` - Timestamps

**Relationships:**
- One-to-Many with UserTree
- One-to-Many with AIInsight

### Tree Model
- `id` (Primary Key)
- `species_name` - Common name (indexed)
- `scientific_name` - Scientific classification
- `avg_co2_absorption` - Average CO₂ absorbed (kg/year)
- `description` - Detailed description
- `suitable_regions` - JSON array of suitable regions
- `sunlight_requirement` - Full sun, partial shade, etc.
- `water_needs` - Low, moderate, high
- `drought_resistant` - Boolean flag
- `growth_rate` - Slow, moderate, fast
- `mature_height_meters` - Expected mature height

**Relationships:**
- One-to-Many with UserTree

### UserTree Model (Junction Table)
- `id` (Primary Key)
- `user_id` (Foreign Key to User)
- `tree_id` (Foreign Key to Tree)
- `date_adopted` - Adoption date (indexed)
- `date_planted` - Actual planting date
- `location` - Specific planting location
- `co2_offset` - Calculated CO₂ offset
- `growth_stage` - seedling, young, mature
- `status` - pending_confirmation, active, etc.

**Methods:**
- `calculate_co2_offset()` - Dynamic CO₂ calculation based on tree age
- `get_tree_age_days()` - Calculate tree age in days
- `update_growth_stage()` - Auto-update growth stage

### AIInsight Model
- `id` (Primary Key)
- `user_id` (Foreign Key to User)
- `tree_id` (Foreign Key to Tree, nullable)
- `user_tree_id` (Foreign Key to UserTree, nullable)
- `message` - AI-generated insight text
- `insight_type` - recommendation, care_tip, motivation, impact_summary
- `ai_model_used` - Model identifier
- `is_read` - Boolean read status
- `created_at` - Timestamp

---

## 🧪 Testing

### Backend Testing (Pytest)
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

**Test Coverage:**
- Authentication flow (register, login, password reset)
- CRUD operations for trees
- AI recommendation endpoints
- Leaderboard aggregation
- Database models and relationships

### Frontend Testing (Jest/React Testing Library)
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- auth
```

**Test Coverage:**
- Component rendering
- Form validation
- Navigation and routing
- API integration
- Protected routes

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push to main branch

### Backend Deployment (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure build command: `pip install -r requirements.txt`
4. Configure start command: `gunicorn app:app`
5. Add environment variables
6. Deploy

### Database Deployment (Render PostgreSQL)
1. Create PostgreSQL database on Render
2. Copy connection string
3. Update backend environment variables
4. Run migrations

---

## 🐛 Challenges Encountered

### 1. Deployment Issues
- **CORS Configuration:** Resolved cross-origin resource sharing issues between frontend and backend
- **Environment Variables:** Properly configured environment-specific settings for development and production

### 2. UI/UX Implementation
- **Figma to Code:** Ensured pixel-perfect implementation of Figma designs
- **Responsive Design:** Created mobile-friendly layouts across all screen sizes

### 3. Performance Optimization
- **API Request Handling:** Implemented pagination and caching strategies
- **Database Queries:** Optimized queries with proper indexing
- **AI Response Times:** Managed HuggingFace API rate limits and response times

---

## 🔮 Future Enhancements

### 📱 Mobile Application
Develop native iOS and Android apps for broader accessibility and better user experience

### 🗺️ Interactive Map View
Visual representation of all adopted trees on an interactive map with geolocation features

### 📸 Tree Growth Photo Logging
Allow users to upload photos documenting their tree's growth journey over time

### 🏫 Institutional Partnerships
Create dedicated portals for schools and corporate sponsorships to participate at scale

### 🎮 Extended Gamification
- Badges and achievements
- Seasonal challenges
- Tree care streaks
- Community goals

### 🤖 Enhanced AI Capabilities
- Improved recommendation accuracy using more environmental data
- Disease detection from uploaded photos
- Predictive care alerts based on weather patterns
- Multi-language support for global reach

### 📊 Advanced Analytics
- Carbon footprint visualization
- Environmental impact reports
- Tree growth predictions
- Community impact dashboards

---

## 🌍 Expected Impact

### 1. Increased Community Participation
Making environmental action accessible and engaging for individuals worldwide

### 2. Higher Tree Survival Rates
Ongoing personalized care guidance ensures trees thrive beyond initial planting

### 3. Scalable Data-Driven Reforestation
Collecting valuable data on tree growth and regional suitability for future initiatives

### 4. Long-term Environmental Responsibility
Building lasting habits and awareness around climate action and sustainability

### Measurable Outcomes
- **Trees Adopted:** Track total number of trees under care
- **CO₂ Offset:** Measure collective carbon absorption impact
- **User Engagement:** Monitor active users and care insights followed
- **Survival Rate:** Track percentage of trees reaching maturity

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

This is a Moringa School capstone project developed by Michael Fuchaka, Victor Mwatu, and Fletcher Kariuki. For questions or suggestions, please contact the team members.

---

## 🙏 Acknowledgments

- **HuggingFace** for AI model access
- **Anthropic's Claude** for development assistance
- **SDG 13: Climate Action** for inspiration and guidance
- Our instructors and special thanks to our TM Beatrice Wambui for valuable guidance and support
