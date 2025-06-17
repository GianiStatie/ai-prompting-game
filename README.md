# AI Prompting Game

A prompt-engineering playground to test and sharpen your prompting skills.
Challenge the AI to reveal a secret password. Each time you succeed, it levels up—getting harder to crack.

![img](docs/preview.gif)


## 🧠 What Is This?
An interactive game where you craft prompts to trick an AI into giving up a hidden password. It's a hands-on way to explore prompt design, adversarial thinking, and AI behavior.

🎮 **[Play it here](https://gianistatie.github.io/ai-prompting-game/)**  
🛠️ **[See how it works under the hood](https://2bytesgoat.com/Projects/LanguageModels/Prompt-it!)**

## 🗂 Project Structure

```
ai-prompting-game/
├── frontend/           # React frontend application
│   ├── src/           # Source files
│   ├── public/        # Static files
│   └── package.json   # Frontend dependencies
│
└── backend/           # FastAPI backend application
    ├── main.py        # FastAPI application
    └── requirements.txt # Python dependencies
```

## 🚀 Getting Started

### 🔧 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### ⚙️ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`
