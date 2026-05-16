# ProjectFlow - Full-Stack Project Management Dashboard

A modern, responsive, and beautiful project management application built with Next.js 16, Tailwind CSS, Prisma, and NextAuth.js.

## 🚀 Features

### **Task Management**
- Create, Edit, and Delete tasks.
- Assign tasks to team members.
- Set Priorities (`Low`, `Medium`, `High`) and Due Dates.
- Update task status (`To Do`, `In Progress`, `Done`).
- Dashboard cards showing real-time task statistics (including `Overdue` tasks calculation).

### **Team Management**
- `Admin` role can invite new team members via email.
- Real-time team roster with status (`Active` / `Invited`) and role badges.
- Admins can change member roles (`Admin` / `Member`) or remove members entirely.
- Glassmorphism UI styling with glowing hover effects and avatars.

### **Authentication & Roles**
- Secure NextAuth JWT authentication.
- Role-based Access Control (RBAC):
  - **Admins**: Full access to all projects, tasks, and team management.
  - **Members**: Can only view projects they belong to, and manage tasks assigned to them.

### **Modern UI/UX**
- **Sora** Font typography for a sleek and modern look.
- **Deep Purple & Indigo Gradients** across the sidebar and layout.
- Soft mesh radial background.
- Premium **Glassmorphism** styling for cards, tables, and modals (`backdrop-blur-md`).
- Smooth animations and micro-interactions on hover and modal transitions.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js API Routes (REST).
- **Database**: PostgreSQL (Production) / SQLite (Development) with Prisma ORM.
- **Auth**: NextAuth.js (Credentials Provider).

---

## 💻 Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Database URL (SQLite for local dev by default, or PostgreSQL)
   DATABASE_URL="file:./dev.db"

   # NextAuth Settings
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key-32-chars-long"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   *The app will be running at [http://localhost:3000](http://localhost:3000)*

---

## 🌐 Deployment (Railway & Vercel)

### **Backend (PostgreSQL on Railway)**
1. Go to [Railway.app](https://railway.app/).
2. Create a new **PostgreSQL** database.
3. Copy the connection string.
4. Update `prisma/schema.prisma` provider to `"postgresql"`.
5. Run `npx prisma db push` with the Railway `DATABASE_URL` to apply the schema.

### **Frontend (Vercel)**
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Add the following **Environment Variables** in Vercel:
   - `DATABASE_URL`: Your Railway PostgreSQL connection string.
   - `NEXTAUTH_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`).
   - `NEXTAUTH_SECRET`: A secure random string.
4. Set the Build Command: `npx prisma generate && npm run build`.
5. Click **Deploy**. Your app is now live!
