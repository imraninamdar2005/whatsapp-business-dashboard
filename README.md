 📱 WhatsApp Business Dashboard

A modern, high-performance WhatsApp Business Dashboard built with the power of React, TypeScript, and shadcn/ui. This project meticulously replicates the visual experience of WhatsApp Web while providing a robust foundation for building enterprise-grade engagement systems, analytics dashboards, or CRM integrations.

🚀 Live Demo:(https://whatsapp-business-dashboard-elwl.vercel.app/)

📑 Table of Contents

🌟 Overview

✨ Features

🛠️ Tech Stack

📂 Project Structure

📸 Screenshots & Demo

⚡ Setup & Installation

📜 Available Scripts

🚀 Deployment Guide

🔌 API Integration

🗺️ Roadmap

🤝 Contributing

⚖️ License

🌟 Overview

WhatsApp Business Dashboard is designed as a clean, modular, and pixel-perfect frontend interface to simulate professional messaging workflows. Whether you are building a customer support tool, a sales CRM, or an automated bot interface, this dashboard provides the perfect starting point.

Key Components:

💬 Chat Interface: Fully immersive messaging experience.

📇 Contact Management: sleek list views with avatars.

🔍 Smart Search: Instant message and contact filtering.

📱 Responsive Design: Works seamlessly on desktop and tablet.

Although it currently runs on mock data, the architecture is pre-wired for rapid integration with the WhatsApp Business Cloud API, WebSockets, or any custom backend.

✨ Features

🎨 UI/UX Excellence

Pixel-Perfect Replica: A modern interface inspired by WhatsApp Web.

Responsive Grid: Adapts fluidly to different screen sizes.

Theming: Dark/Light mode ready for visual comfort.

Micro-interactions: Smooth animations for a polished feel.

💬 Advanced Chat System

Live Previews: Chat list with dynamic last message and timestamps.

Smart Grouping: Message bubbles group automatically by sender.

Contextual Details: Read receipts, timestamps, and typing indicators.

Auto-Scroll: Always jump to the latest conversation.

🧩 Component Architecture

Modular: Built with reusable components for easy scaling.

Modern UI: Powered by shadcn/ui and Tailwind CSS.

Iconography: Beautiful SVG icons via Lucide React.

👨‍💻 Developer Experience

Type Safety: 100% TypeScript for robust code.

Fast Build: Instant HMR (Hot Module Replacement) with Vite.

Clean Structure: Logical folder organization for easy navigation.

🛠️ Tech Stack

Category

Technology

Description

Framework

⚛️ React + TypeScript

The core library for UI logic.

Build Tool

⚡ Vite

Blazing fast build tool.

UI Library

🧱 shadcn/ui

Accessible and customizable components.

Styling

🌬️ Tailwind CSS

Utility-first CSS framework.

Icons

🔦 Lucide Icons

Clean and consistent icon pack.

State

🎣 React Hooks

Native state management (Scalable to Zustand).

📂 Project Structure

src/
 ├── 🧩 components/
 │   ├── 💬 chat/         # Chat window, bubbles, inputs
 │   ├── 📋 sidebar/      # Contact lists, search bars
 │   └── 🧱 ui/           # Shared shadcn/ui components
 ├── 💾 data/             # Mock data for rapid prototyping
 │   ├── contacts.ts
 │   └── messages.ts
 ├── 📐 layout/           # Main application wrappers
 │   └── DashboardLayout.tsx
 ├── 📄 pages/            # Page-level components
 ├── ⚛️ App.tsx           # Root component
 ├── 🚀 main.tsx          # Entry point
 └── 🎨 index.css         # Global styles & Tailwind directives


📸 Screenshots & Demo

🔴 Live Application

👉 Click here to view the live demo

🖥️ Dashboard Preview

(Capture your screen and place dashboard.png in a /screenshots folder)

<!--  -->

📱 Mobile View

<!--  -->

🎥 Demo Video

<!-- Watch the Walkthrough -->

⚡ Setup & Installation

Get up and running in less than 2 minutes!

1️⃣ Clone the repository

git clone [https://github.com/imraninamdar2005/whatsapp-business-dashboard.git](https://github.com/imraninamdar2005/whatsapp-business-dashboard.git)
cd whatsapp-business-dashboard


2️⃣ Install dependencies

npm install


3️⃣ Run development server

npm run dev


🚀 Open your browser at: http://localhost:5173

📜 Available Scripts

Command

Action

npm run dev

🟢 Starts the local development server.

npm run build

🏗️ Generates a production-ready build in dist/.

npm run preview

👁️ Preview the production build locally.

🚀 Deployment Guide

Deploy easily to any static hosting provider.

Build the project:

npm run build


Deploy the dist/ folder to Vercel, Netlify, or GitHub Pages.

Vercel Quick Deploy:

vercel deploy

🔌 API Integration (Optional)

Ready to go real? The WhatsApp Business Dashboard is built to be backend-agnostic.

Data Layer: Replace src/data/*.ts with API calls (React Query recommended).

Real-time: Hook up Socket.io or Firebase listeners in App.tsx.

CRUD: Use standard fetch or Axios in your service layer.

🗺️ Roadmap

🚀 Short-Term

[ ] 🔎 Advanced Search & Filtering

[ ] 🌙 Dark Mode Toggle

[ ] 💅 Enhanced Message Bubble Styling

🛠️ Mid-Term

[ ] 🔗 Backend API Connection (Node/Express)

[ ] 📊 Analytics Widgets & Charts

[ ] ✍️ Contact Editing & Creation

🔮 Long-Term

[ ] 👥 Multi-user Role Management

[ ] 🤖 WhatsApp Template Message Editor

[ ] ☁️ Cloud Persistence (Supabase/Firebase)

🤝 Contributing

We love contributions! Let's build something amazing together.

🍴 Fork the repository.

🌿 Create a Feature Branch.

💾 Commit your changes.

🚀 Submit a Pull Request.

⚖️ License

Distributed under the MIT License.
Build, modify, and distribute freely.

