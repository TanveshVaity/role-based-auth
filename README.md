# Role-Based Auth App

A **Next.js** application with **role-based authentication** using **Clerk**, **Prisma** with **MongoDB**, and support for webhook testing via **LocalTunnel**.

---

## 💡 Features

- **Next.js** web app 
- **User authentication & user management** via Clerk  
- **Role-based access control** with user roles (e.g., master, admin)  
- **Prisma** ORM connected to **MongoDB Atlas**  
- **API webhook** endpoint to receive events from Clerk (using LocalTunnel in dev)  
- Secure session & webhook signature handling  

---

## 🛠️ Prerequisites
Make sure you have:
- **Node.js** v16 or later  
- **Yarn** or **npm**  
- A **MongoDB Atlas** account + cluster  
- A **Clerk** account (for API keys and webhook setup)  
- **LocalTunnel** (for local webhook testing)

##  Getting Started

### 1. Clone & install

```bash
git clone https://github.com/TanveshVaity/role-based-auth.git
cd role-based-auth
yarn install
# or
npm install

### 2. Configure environment
Open .env and replace placeholders:
```env
    DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/role-based-auth?retryWrites=true&w=majority&appName=Cluster0"

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

    CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```
### 3. Setup MongoDB
- Create a MongoDB Atlas cluster (free tier is fine)
- Copy the connection string and set it in the DATABASE_URL in .env.

### 4. Setup Clerk

- Sign up at Clerk.dev.
- Create a frontend application.
- Copy your Publishable Key and Secret Key into .env.
- Enable Webhooks and note down your signing secret for CLERK_WEBHOOK_SIGNING_SECRET.

### 5. Epose Webhook Endpoint in Development
Run LocalTunnel to expose your local server:
```bash
    lt --port <port number> 
    #or
    lt --port 3000
```

### 6. Apply Database Migrations
Run this command to apply Prisma migrations:
```bash 
    npx prisma migrate dev --name init
```
This will create the necessary collections and indexes in your MongoDB.

### 7. Start the Development Server
```bash
    npm run dev
    # or
    yarn dev
```
Visit http://localhost:3000

### 8. Assign roles
- Navigate to the Clerk Dashboard, then select Users.
- Choose the user whose role you'd like to update.
- Scroll down to the Metadata section and click Edit under the Public tab.
- Add the following JSON to define the role, for example:
```JSON
    {
        "role": "master"
    }
```
- Save your changes.
- This action updates the user's public_metadata.role field, which can then be used throughout your application for role-based access control. 