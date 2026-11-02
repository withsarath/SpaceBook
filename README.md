# SpaceBook 🏢

> **Modern workspace discovery and on-demand booking platform.**  
> Reserve meeting rooms, creative lofts, private offices, and dedicated desks by the hour or day.

---

## 🌟 Overview

**SpaceBook** is a full-stack marketplace connecting professionals, distributed teams, and creators with inspiring workspaces. Designed with a clean, peer-to-peer marketplace user experience (inspired by Peerspace & Airbnb) and backed by a robust NestJS backend with role-based access control (RBAC).

---

## 🚀 Key Features

### 👤 For Guests & Remote Workers
* **Explore & Filter**: Filter spaces by city, capacity, pricing, amenities (Fiber Wi-Fi, Coffee & Tea, Podcast Studio), and category.
* **Instant Booking**: Real-time hourly rate calculation, seat adjustments, and shift presets (Morning, Afternoon, Full Day).
* **Reservation Hub**: Track upcoming bookings, self check-in keypad codes, and cancellation options.
* **Favorites**: Save and bookmark preferred workspaces.

### 🏢 For Space Owners & Hosts
* **Host Portal**: List and manage properties, upload photos, and configure amenities.
* **Reservation Manager**: View scheduled guest bookings per workspace in real time.
* **Performance Metrics**: Track live listing status, host ratings, and estimated earnings.
* **Host Application Flow**: Straightforward onboarding application with admin review workflow.

### 🛡️ For Platform Administrators
* **Admin Console**: Review, approve, or decline host partnership submissions with custom feedback reasons.
* **Marketplace Overview**: Monitor all active spaces and system-wide users.

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Styling**: Tailwind CSS v4 + Plus Jakarta Sans Typography
* **Icons**: Lucide React
* **Package Manager**: pnpm

### Backend
* **Framework**: NestJS 11 + TypeScript
* **Database & ORM**: PostgreSQL (Neon Serverless) + Drizzle ORM
* **Authentication**: Passport.js + JWT + bcryptjs (RBAC: `customer`, `owner`, `admin`)
* **Validation**: `class-validator` & `class-transformer`
* **Package Manager**: pnpm



### 1. Clone the Repository
```bash
git clone https://github.com/withsarath/SpaceBook.git
cd SpaceBook
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the `backend/` folder:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run database migrations & seed data**:
   ```bash
   # Run Drizzle migrations
   pnpm run drizzle-kit push

   # Seed sample workspaces (optional)
   npx ts-node src/database/seed-workspaces.ts
   ```

5. **Start the backend server**:
   ```bash
   pnpm run start:dev
   ```
   *The API will start at:* `http://localhost:3000`

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the Vite development server**:
   ```bash
   pnpm run dev
   ```
   *The frontend will run at:* `http://localhost:5173`

---

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register customer account | No |
| `POST` | `/api/v1/auth/login` | Authenticate & retrieve JWT | No |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/v1/workspaces` | Get all active workspaces | No |
| `POST` | `/api/v1/workspaces` | Create a new workspace listing | Yes (Owner) |
| `GET` | `/api/v1/workspaces/my-workspaces` | Retrieve spaces owned by current user | Yes (Owner) |
| `POST` | `/api/v1/bookings` | Book a workspace slot | Yes (Customer) |
| `GET` | `/api/v1/bookings/my-bookings` | View logged-in user reservations | Yes (Customer) |
| `POST` | `/api/v1/bookings/:id/cancel` | Cancel an existing reservation | Yes (Customer) |
| `POST` | `/api/v1/owner-applications` | Apply for space host status | Yes (Customer) |
| `GET` | `/api/v1/owner-applications/pending` | Review pending host submissions | Yes (Admin) |
| `PATCH`| `/api/v1/owner-applications/:id/approve` | Approve host application | Yes (Admin) |
| `PATCH`| `/api/v1/owner-applications/:id/reject` | Reject host application with reason | Yes (Admin) |

---

## 📄 License
This project is open-source under the MIT License.

