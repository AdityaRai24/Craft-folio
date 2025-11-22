# CraftFolio - AI-Powered Portfolio Builder

CraftFolio is a modern, AI-powered portfolio builder that helps users create stunning professional portfolios with ease. Built with cutting-edge technologies, it offers a seamless experience for creating, customizing, and managing personal portfolios.

## 🚀 Features

- **AI-Powered Portfolio Generation**: Create professional portfolios using AI assistance
- **Multiple Portfolio Templates**: Choose from various pre-designed templates
- **Real-time Customization**: Simple interface for easy customization
- **Responsive Design**: Mobile-first approach ensuring perfect display across all devices
- **Authentication**: Secure user authentication using Clerk
- **Interactive UI**: Smooth animations and transitions using Framer Motion
- **State Management**: Efficient state management using Redux Toolkit
- **Database Integration**: Persistent storage using Prisma and Supabase
- **Chatbot Integration**: An intelligent chatbot to assist with portfolio creation.
- **Subdomain Deployment**: Deploy your portfolio to a custom subdomain (e.g., `yourname.craftfolio.com`).
- **Slug Deployment**: Deploy your portfolio to a custom slug (e.g., `craftfolio.com/yourname`).

## 🛠️ Tech Stack

### Frontend : 
- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Animation**: Framer Motion
- **UI Components**: Radix UI
- **Authentication**: Clerk
- **Code Highlighting**: React Syntax Highlighter
- **PDF Processing**: PDF.js

### Backend
- **API**: Next.js API Routes
- **Database**: Prisma ORM
- **Cloud Storage**: Supabase
- **AI Integration**: Google Generative AI
- **Validation**: Zod

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Containerization**: Docker

## 🏗️ Project Structure

```
craftfolio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── portfolio-sites/   # Portfolio templates
│   ├── my-portfolios/     # User portfolios
│   └── profile/          # User profile management
├── components/            # Reusable React components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── store/               # Redux store configuration
```

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/AdityaRai24/Craft-folio.git
cd Craft-folio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

First, copy the `.env.example` file to a new `.env` file in the root of your project.

```bash
cp .env.example .env
```

Next, you'll need to fill in the values in the `.env` file. Here's how to get them:

-   **Clerk**: Go to your [Clerk Dashboard](https://dashboard.clerk.com/). Create a new application and navigate to the "API Keys" section.
    -   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Use the "Publishable key".
    -   `CLERK_SECRET_KEY`: Use the "Secret key".
    - The sign-in and sign-up redirect URLs can be left as they are in the `.env.example` file.

-   **Cloudinary**: This is used for image uploads. Go to your [Cloudinary Dashboard](https://cloudinary.com/console).
    -   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: This is your "Cloud Name" found on the dashboard.
    -   `NEXT_PUBLIC_CLOUDINARY_PRESET`: Go to Settings (gear icon) -> Upload. Find the "Upload presets" section and either use an existing one or create a new one. Copy the preset name.

-   **Google Gemini**: For AI features. Go to the [Google AI Platform](https://makersuite.google.com/app/apikey).
    -   `GEMINI_API_KEY`: Create a new API key.

-   **Supabase**: This is for your database and storage.
    1.  Go to your [Supabase Dashboard](https://app.supabase.io/) and create a new project.
    2.  Once the project is ready, go to Connect Button in Navbar.
        -----  GO TO THE APP FRAME WORKS TAB. MAKE SURE FRAMEWORK IS SET TO NEXTJS.
        -   `NEXT_PUBLIC_SUPABASE_URL`: This is the "Project URL".
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: This is the "Project API Key" (the `public` `anon` key).
        -----  GO TO THE ORMS TAB. MAKE SURE TOOL IS SET TO PRISMA.
        -   `DATABASE_URL`: DB URL
        -   `DIRECT_URL`: Direct url
    3. Copy and paste these 4 values in your .env file
    
### 4. Set Up the Database

Run the following commands to sync your schema with the database:

```bash
npx prisma generate
npx prisma db push
```

After running these commands, go to the "Table Editor" in your Supabase project. You should see four new tables created.

### 5. Seed the Database

The project includes a SQL dump file with necessary initial data.

1.  Open the `db_dump.sql` file in the root of this project and copy its entire contents.
2.  In your Supabase project, navigate to the "SQL Editor".
3.  Paste the copied SQL into a new query and click "RUN".

### 6. Run the Development Server

Now you are all set! Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🐳 Docker Support

The project includes Docker configuration for easy deployment:

# Build the Docker image
docker build -t adityarai24/craft-folio-app .

# Run the container
docker run -p 3000:3000 adityarai24/craft-folio-app

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For any queries or support, please reach out to [adityarai407@example.com]
