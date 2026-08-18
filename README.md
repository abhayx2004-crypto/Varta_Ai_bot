# ContextaAiHub 💬

ContextaAiHub is a MERN-based domain-specific AI chatbot platform designed to be embedded into websites as a floating chat widget.

For the current demo, ContextaAiHub is embedded into **EventEase**, a fictional event-discovery website. The assistant can answer questions about EventEase events, categories, pricing, and contact information while also using visitor onboarding information to personalize conversations.

The project uses React, Vite, Node.js, Express, MongoDB, and the Groq API.

---

## 🚀 Core Features

* 🔌 **Embeddable AI Chatbot Widget**
  A floating chatbot widget that can be embedded into a website using a single script tag.

* 🌐 **EventEase Demo Website**
  A modern event-discovery website containing events, categories, pricing, contact details, and social links.

* 🧑‍💻 **Visitor Onboarding**
  Visitors provide their name, interests, and event preferences before starting a conversation.

* 🧠 **Domain-Specific AI Context**
  The Groq-powered assistant is configured specifically for EventEase and can answer questions about its events, pricing, and available information.

* 👤 **Personalized Conversations**
  Visitor onboarding information is passed to the AI so responses can be personalized.

* 💾 **Conversation Storage**
  Visitor profiles, conversations, and messages are stored in MongoDB.

* 📊 **Admin Dashboard**
  The admin portal provides visitor counts, conversation statistics, profession/interest breakdowns, and conversation transcripts.

* 🔐 **Backend Admin Authentication**
  Admin login is checked by the backend using the configured `ADMIN_PASSWORD` environment variable.

* 📱 **Responsive UI**
  The EventEase website and chatbot interface are designed to work across desktop and mobile screen sizes.

* 💾 **Saved Events**
  EventEase allows visitors to save events locally using browser `localStorage`.

* 🔎 **Event Search and Filtering**
  Visitors can search events and filter them by category.

* 📋 **Event Details and Registration Demo**
  Event cards provide detail popups and demo registration interactions.

---

## 📁 Project Structure

```text
ContextaAiHub/
│
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── WidgetChat.jsx
│   │   ├── App.jsx
│   │   └── ...
│   └── ...
│
├── server/                     # Express backend
│   ├── models/
│   │   ├── Visitor.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   │
│   ├── public/
│   │   └── widget.js           # Embeddable widget loader
│   │
│   ├── .env.example
│   ├── config.js               # AI/system prompt configuration
│   └── server.js               # Express API and server
│
├── index.html                  # EventEase demo website
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## 🛠️ Quick Start

### 1. Prerequisites

Install:

* Node.js
* MongoDB Atlas or a MongoDB server
* A Groq API key

---

### 2. Configure Environment Variables

Inside the `server/` folder, create a `.env` file from `.env.example`.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
ADMIN_PASSWORD=your_admin_password
```

**Do not commit `server/.env` to GitHub.**

---

### 3. Install Dependencies

From the project root:

```bash
npm run install-all
```

---

### 4. Start the Application

Run:

```bash
npm run dev
```

The development setup provides:

```text
EventEase Website
http://localhost:5173/

Admin Dashboard
http://localhost:5173/admin

Backend API
http://localhost:5000
```

---

## 🌐 EventEase Demo Website

The root `index.html` acts as the demonstration website.

It contains:

* Featured events
* Event categories
* Search functionality
* Event filtering
* Event details
* Save-event functionality
* Pricing plans
* Contact information
* Social media links
* ContextaAiHub chatbot widget

The chatbot is embedded into the page using the widget loader.

---

## 🔌 Widget Integration

The chatbot can be embedded into another website by adding the widget script inside the website's `<body>`:

```html
<script src="http://localhost:5000/widget.js"></script>
```

For deployment, replace the local backend address with the public backend/application URL.

Example:

```html
<script src="https://your-domain.com/widget.js"></script>
```

The widget automatically creates the floating chatbot button and opens the chatbot interface in an iframe.

---

## 🧠 AI Context

The EventEase assistant is configured through:

```text
server/config.js
```

The system prompt provides the AI with information about:

* EventEase
* Event categories
* Event names
* Event dates
* Event times
* Event locations
* Pricing plans
* Contact information

Visitor information is also added to the AI context during chat requests so that responses can be personalized.

---

## 📊 Admin Dashboard

The admin dashboard is available at:

```text
http://localhost:5173/admin
```

The dashboard provides:

* Total visitors
* Total conversations
* Total messages
* Visitor interest/profession breakdown
* Recent conversations
* Conversation transcripts

The admin password is configured through:

```env
ADMIN_PASSWORD=your_admin_password
```

The password is checked by the backend instead of being stored in the frontend source code.

---

## 🔗 API Endpoints

### Onboard Visitor

```http
POST /api/widget/onboard
```

Creates a visitor profile and a conversation.

Example request:

```json
{
  "name": "Alex",
  "profession": "technology",
  "goal": "Find AI and startup events"
}
```

---

### Fetch Visitor History

```http
GET /api/widget/history/:visitorId
```

Retrieves the visitor's latest conversation and stored messages.

---

### Send Chat Message

```http
POST /api/widget/chat
```

Example:

```json
{
  "visitorId": "visitor_id",
  "conversationId": "conversation_id",
  "text": "Which technology events are available?"
}
```

---

### Analytics

```http
GET /api/analytics
```

Returns visitor, conversation, message, and interest statistics.

---

### Conversations

```http
GET /api/conversations
```

Returns recent conversation records for the admin dashboard.

---

### Conversation Details

```http
GET /api/conversations/:id
```

Returns the selected conversation and its messages.

---

## 🗄️ MongoDB Collections

The application uses three primary collections:

```text
visitors
conversations
messages
```

Visitor information and chat messages are stored in MongoDB so that the admin dashboard can display conversation data.

---

## ☁️ Production Deployment

The application can be deployed as a single web service because the Express backend serves the built React frontend.

### 1. Build the frontend

From the project root:

```bash
npm run build --prefix frontend
```

This creates:

```text
frontend/dist/
```

---

### 2. Push the project to GitHub

Make sure sensitive files such as:

```text
server/.env
node_modules/
```

are excluded from the repository.

The `.gitignore` file already ignores `.env` and `node_modules`.

---

### 3. Deploy to Render

Create a new **Web Service** on Render and connect the GitHub repository.

Use:

**Build Command**

```bash
npm run install-all && npm run build --prefix frontend
```

**Start Command**

```bash
npm start --prefix server
```

---

### 4. Add Environment Variables

Configure these variables in Render:

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
ADMIN_PASSWORD=your_admin_password
```

The application also supports the `PORT` supplied by the deployment platform.

---

## 📱 Final Demo Structure

After deployment, the intended flow is:

```text
Public URL
     ↓
EventEase Website
     ↓
ContextaAiHub Chatbot
     ↓
Groq AI
     ↓
MongoDB
```

Admin:

```text
your-domain.com/admin
```

Public demo:

```text
your-domain.com/
```

---

## 🔒 Security Notes

* Keep `server/.env` out of GitHub.
* Never place the Groq API key inside frontend code.
* Keep the admin password in the backend environment variables.
* Use environment variables for production credentials.
* The social-media links and EventEase contact information in the demo are fictional demonstration content.

---

## 🎯 Project Goal

The main goal of ContextaAiHub is to demonstrate how a **domain-specific AI assistant can be embedded into an existing website** and use the website's domain information to provide relevant conversational assistance.

For the current demonstration, that domain is:

```text
EventEase
```

and the embedded assistant is:

```text
ContextaAiHub
```
