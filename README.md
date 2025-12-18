# Pathoria
### An Agent-Based Intelligent Game for Learning, Strategy & Exploration

## Problem Statement: PS2 – Gamified Learning Environment for AgentX

Pathoria is a **gamified, AI-driven interactive environment** designed to demonstrate intelligent agent behavior through exploration, decision-making, and adaptive learning.  
The project blends **game mechanics with AI concepts**, making it both engaging and technically strong — ideal for hackathons and AI-focused showcases.

---

## Project Overview

Pathoria simulates a dynamic game world where **AgentX**, an intelligent agent, navigates environments, makes strategic choices, and improves performance based on rewards and outcomes.

The game is designed to:
- Encourage **learning through gameplay**
- Demonstrate **agent-based intelligence**
- Showcase **AI + software engineering skills**

---

## Demo

The application itself acts as the demo.  
Running `npm run dev` launches the interactive game environment, where users can explore themed worlds, observe agent progression, and experience reward-based gameplay mechanics.

---

## Core Concepts Used

- Agent-based decision making  
- Reward-driven learning mechanics  
- State & environment representation  
- Game logic and progression systems  
- Modular and scalable design  

---

## Game Mechanics

- **Player & Agent Interaction**  
  The player and AgentX coexist in the same environment, influencing outcomes.

- **Exploration Paths**  
  Multiple paths and choices affect rewards and performance.

- **Actions & Decisions**  
  AgentX can explore, react, assist, or act independently.

- **Scoring System**  
  Points are awarded based on:
  - Efficient decisions  
  - Exploration success  
  - Strategic behavior  

---

## Reward Structure

| Action Type | Reward Impact |
|------------|--------------|
| Optimal decision | High positive reward |
| Neutral action | Small reward |
| Risky / inefficient action | Penalty |
| Goal completion | Bonus score |

This reward shaping enables **progressive agent improvement**, which is central to PS2.

---

## Performance Metrics

- Total score achieved  
- Time taken to reach goals  
- Decision efficiency  
- Exploration coverage  
- Agent behavior consistency  

These metrics help evaluate **agent intelligence and learning progress**.

---


## Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **Styling:** Tailwind CSS  
- **Game Logic:** Config-driven mechanics  
- **Audio:** Sound-based feedback system  
- **Version Control:** Git & GitHub  

---

## How to Run Locally

### Prerequisites
- Node.js >= 18
- npm

### Steps

```bash
git clone https://github.com/Vyshvika/PlayNova_Game.git
cd games
npm install
npm run dev
```
## Demo

The application itself acts as the demo.  
Running `npm run dev` launches the interactive game environment, where users can explore themed worlds, observe agent progression, and experience reward-based gameplay mechanics.

---

## 📁 Project Structure

```text
games/
├── public/
│   └── sounds/              # Game sound effects
├── src/
│   ├── app/
│   │   ├── components/      # UI components
│   │   ├── config/          # World themes & game configs
│   │   ├── hooks/           # Custom hooks (sound, controls, etc.)
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Core game logic & helpers
│   ├── assets/              # Static assets
│   ├── styles/              # Tailwind & global styles
│   ├── App.tsx              # Root application component
│   └── main.tsx             # App entry point
├── index.html               # HTML entry
├── package.json             # Dependencies & scripts
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```
---
## Team 
-  Team name  : TaskX
-  Team members : Vyshvika , Archusma , Lohitha
---
## Data Handling & Privacy

Large datasets are excluded due to size and confidentiality constraints.
The focus of this project is on game mechanics, agent behavior, and system design, ensuring reproducibility without exposing sensitive data.






