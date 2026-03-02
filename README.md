# 🎵 MoodTune — AI Music Recommendation System

An AI-powered music app that recommends songs based on your mood using NLP and the GTZAN dataset.

## Features
- 🧠 Mood-based recommendations using NLP
- 🎵 Real audio playback (1000 GTZAN tracks)
- 👤 Email OTP authentication
- 📊 Listening stats dashboard
- 🎨 6 themes + custom color picker
- 📱 Mobile responsive

## Tech Stack
- **Frontend:** React.js
- **Backend:** Flask (Python)
- **Database:** SQLite
- **Dataset:** GTZAN (1000 tracks)

## Setup
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv soundfile
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000**
