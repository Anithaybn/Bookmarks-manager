# 🔖 Smart Bookmark Manager

A modern bookmark management application that allows users to securely save, organize, and manage their bookmarks with real-time synchronization.

---

## 🚀 Live Demo

## https://bookmarks-manager-tau.vercel.app/

## ✨ Features

- 🔐 **Google OAuth Authentication**
  - Seamless login using Google via Supabase Auth

- ➕ **Add Bookmarks**
  - Save bookmarks with title and URL
  - Input validation with user feedback

- 🔒 **Private Bookmarks**
  - Each user can only access their own bookmarks
  - Enforced using Supabase Row Level Security (RLS)

- ⚡ **Real-Time Sync**
  - Bookmarks update instantly across tabs
  - Powered by Supabase Realtime subscriptions

- ❌ **Delete Bookmarks**
  - Secure deletion with confirmation prompt

- ⭐ **Favorite Bookmarks (Bonus Feature)**
  - Mark important bookmarks as favorites
  - Favorites appear at the top for quick access

---

## 🧠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Supabase (Auth + PostgreSQL + Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## 🏗️ Architecture Overview

- Supabase handles:
  - Authentication (Google OAuth)
  - Database (PostgreSQL)
  - Realtime subscriptions

- Next.js handles:
  - UI rendering
  - State management
  - API interaction via Supabase client

---

## 🔐 Security

- Row Level Security (RLS) ensures:
  - Users can only access their own data
  - Policies enforce `user_id = auth.uid()`

---

## ⚡ Realtime Implementation

- Subscribed to `postgres_changes` on `bookmarks` table
- Listens for insert, update, and delete events
- Automatically refetches data on change

---

## 🎨 UI/UX Highlights

- Clean dashboard layout
- Responsive design
- Interactive elements (hover effects, transitions)
- Empty states and feedback messages

---

## 💡 Bonus Feature

**Favorites ⭐**

Users can mark bookmarks as favorites to prioritize important links.
Favorites are visually highlighted and sorted to the top for better accessibility.

---

## 🔮 Future Improvements

- 📁 **Folder Organization**
  - If I had more time, I would implement a folder-based system to organize bookmarks into categories (similar to chrome bookmarks). This would improve scalability and usability as the number of bookmarks grows.

- 🔗 **Improved URL Validation**
  - Currently, only basic validation is implemented. With more time, I would enhance this by adding proper URL validation (e.g., enforcing valid formats like `https://`) and better inline error feedback for a smoother user experience.

## 🛠️ Setup Instructions

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Add environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. Run the app:

   ```bash
   npm run dev
   ```

---

## 🙌 Author

Built as a take-home assignment to demonstrate full-stack development, real-time systems, and product thinking.

---
