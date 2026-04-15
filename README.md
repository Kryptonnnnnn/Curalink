# 🧠 Curalink AI — Medical Research Assistant

Curalink AI is a full-stack AI-powered medical research assistant that aggregates real-time data from multiple research sources and generates structured insights using LLMs.

---

## 🚀 Live Demo

- 🌐 Frontend: https://curalink-gules.vercel.app  
- ⚙️ Backend API: https://curalink-1-ltoq.onrender.com  

---

## ✨ Features

- 🔍 Search medical queries (disease, treatments, trials)
- 📄 Fetch research papers from PubMed & OpenAlex
- 🧪 Retrieve clinical trials data
- 🤖 AI-generated summaries using Groq LLM
- 💾 Chat history stored in MongoDB
- ⚡ Real-time responses with retry handling
- 🌐 Fully deployed (Vercel + Render)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### AI & APIs
- Groq API (LLM)
- PubMed API
- OpenAlex API
- ClinicalTrials.gov API

---

## 🚀 Getting Started

 ### Clone Repository
 - git clone https://github.com/kryptonnnnnn/curalink.git
 - cd curalink
   
 ### Setup Backend
 - cd backend
 - npm install
   
 ### Setup Frontend
 - cd frontend
 - npm install

## Create .env file (VERY IMPORTANT)

Inside backend/ create:
.env

### Add this:

- PORT=5000

- GROQ_API_KEY=your_groq_api_key_here
- MONGO_URI=your_mongodb_connection_string


## Start Backend
- node server.js

👉 You should see:

- Server running on port 5000
= MongoDB connected

## Setup Frontend

- Open new terminal:

- cd frontend
- npm install
- npm start

## IMPORTANT CHANGE (LOCAL API)

- In your frontend file:

- const API_URL = "http://localhost:5000/api/query/";

👉 NOT your Render URL

✅ DONE — Open in browser
- http://localhost:3000


