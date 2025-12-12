 WhatsApp Business Dashboard

A modern, high-performance WhatsApp Business Dashboard built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
This project replicates the core visual experience of WhatsApp Web while providing a clean foundation for building real WhatsApp Business integrations, dashboards, analytics, or customer engagement systems.

🚀 Live Demo: whatsapp-business-dashboard-elwl.vercel.app

Table of Contents

Overview

Features

Tech Stack

Project Structure

Screenshots & Demo

Setup & Installation

Available Scripts

Deployment Guide

Environment Variables

API Integration (Optional)

Roadmap

Contributing

License

Overview

WhatsApp Business Dashboard is designed as a clean and modular frontend interface to simulate WhatsApp-style messaging workflows.
It includes core UI components such as:

Chat list

Chat window

Contact list

Message bubbles

Search functionality

Although it currently uses mock data, the architecture allows quick integration with real APIs such as the WhatsApp Business Cloud API, WebSockets, or custom backend services.

Features

UI/UX

Modern WhatsApp Web–inspired layout

Responsive grid system

Dark/light mode ready

Smooth animations (optional)

Chat System

Chat list with avatars and last message preview

Timestamp formatting

Typing indicator support

Message grouping & alignment

Scroll-to-latest message behavior

Components

Fully reusable UI components

Powered by shadcn/ui + TailwindCSS

Iconography via Lucide Icons

Developer Experience

TypeScript-first architecture

Vite for instant hot reload

Modular folder structure

Easy API binding points

Tech Stack

Category

Technology

Framework

React + TypeScript

Build Tool

Vite

UI Library

shadcn/ui

Styling

Tailwind CSS

Icons

Lucide Icons

State Management

React Hooks (can extend to Zustand/Jotai)

Project Structure

src/
 ├── components/
 │   ├── chat/
 │   ├── sidebar/
 │   └── ui/
 ├── data/
 │   ├── contacts.ts
 │   └── messages.ts
 ├── layout/
 │   └── DashboardLayout.tsx
 ├── pages/
 ├── App.tsx
 ├── main.tsx
 └── index.css



Key principles:

Component-driven development

Separation of UI, data, and layout

Easily scalable to multi-page or multi-module systems

Screenshots & Demo

Live Application

🚀 View Live Demo

Dashboard Preview

<!-- Upload your image to a 'screenshots' folder and uncomment the line below -->

<!--  -->

(Place your screenshot here showing the main chat interface)

Mobile Responsiveness

<!--  -->

Demo Video

<!-- Link to Loom, YouTube, or generic video file -->

Watch the Demo Video

Setup & Installation

1. Clone the repository

git clone [https://github.com/imraninamdar2005/whatsapp-business-dashboardv2.git](https://github.com/imraninamdar2005/whatsapp-business-dashboardv2.git)
cd whatsapp-business-dashboardv2


2. Install dependencies

npm install


3. Run development server

npm run dev


App runs at:
http://localhost:5173

Available Scripts

Command

Description

npm run dev

Start development server

npm run build

Generate production build

npm run preview

Preview production build

Deployment Guide

After running:

npm run build


The dist/ folder can be deployed on:

Vercel

Netlify

GitHub Pages

Cloudflare Pages

Any static hosting (Nginx, Apache)

Vercel Deployment

vercel deploy


or drag the dist/ folder into the Vercel dashboard.

Environment Variables

For the mock version, no environment variables are required.

To enable real API integrations, create a .env file in the root directory:

VITE_WHATSAPP_API_URL=[https://graph.facebook.com/v17.0/](https://graph.facebook.com/v17.0/)
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WEBHOOK_URL=your_webhook_url


API Integration (Optional)

To integrate with the WhatsApp Business Cloud API, you can:

Replace mock data in src/data/ with live API calls

Use fetch or Axios for message CRUD

Add real-time updates via:

WebSockets

Firebase

Pusher

GraphQL Subscriptions

Roadmap

Short-Term

[ ] Add search/filter

[ ] Add dark mode

[ ] Improve message bubble styling

[ ] Add message status indicators

Mid-Term

[ ] Connect to a backend API

[ ] Add analytics widgets

[ ] Add contact creation/editing

[ ] Real-time chat (WebSockets)

Long-Term

[ ] Multi-user support

[ ] Role-based access

[ ] WhatsApp API template messages

[ ] Cloud-based storage (Supabase / Firebase)

Contributing

Contributions are welcome.

Fork the repository

Create a feature branch

Commit changes

Submit a pull request

License

Distributed under the MIT License.
You may use, modify, and distribute this project freely.
