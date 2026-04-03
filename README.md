# 🐛 BugExplain AI

An AI-powered debugging assistant that helps developers quickly understand and fix errors. Paste any error message or buggy code and get detailed explanations, root cause analysis, fix steps, and corrected code — all powered by OpenAI GPT-3.5.

## ✨ Features

- 🤖 **AI-Powered Solutions** - Get instant explanations and fixes using GPT-3.5-turbo
- 🔐 **Google OAuth Authentication** - Secure login with Supabase Auth
- 💾 **Chat History** - All your conversations are saved and synced
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔒 **Row Level Security** - Your data is completely private and secure

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))
- A Google Cloud Console project with OAuth 2.0 credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abishekcsharptek-cmyk/BugExplain-Ai.git
   cd BugExplain-Ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Fill in your credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

4. **Set up the database**
   
   Run the schema in your Supabase project:
   - Go to Supabase Dashboard → SQL Editor
   - Copy the contents of `database/schema.sql`
   - Paste and run it

   For detailed setup instructions, see [database/SETUP_GUIDE.md](database/SETUP_GUIDE.md)

5. **Configure Google OAuth**
   
   Follow the instructions in [database/SETUP_GUIDE.md](database/SETUP_GUIDE.md#3-google-oauth-setup) to:
   - Create OAuth credentials in Google Cloud Console
   - Configure the authorized redirect URIs
   - Enable Google provider in Supabase Authentication

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
BugExplainAi/
├── src/
│   ├── components/     # Reusable React components
│   ├── context/        # React Context (Auth)
│   ├── lib/           # Supabase client
│   ├── pages/         # Page components
│   ├── assets/        # Images and static files
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── database/          # Database schema and docs
│   ├── schema.sql     # Main database schema
│   ├── SETUP_GUIDE.md # Detailed setup instructions
│   └── migrations/    # Optional migrations
└── public/            # Public assets
```

## 🗄️ Database Schema

The app uses a simple but powerful schema:

- **chats** table - Stores all user conversations
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to auth.users)
  - `question` (TEXT)
  - `response` (TEXT)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

Row Level Security (RLS) ensures users can only access their own data.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Import the repository in Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## 📖 Usage

1. **Sign In** - Click "Continue with Google" to authenticate
2. **Paste Error** - Paste any error message or buggy code
3. **Get AI Fix** - Receive detailed explanation and solution
4. **View History** - Access all your past conversations in the sidebar

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abhishek C Sharptek**
- GitHub: [@abishekcsharptek-cmyk](https://github.com/abishekcsharptek-cmyk)

## 🙏 Acknowledgments

- OpenAI for the GPT-3.5-turbo API
- Supabase for the amazing backend platform
- React and Vite communities for excellent tools

---

Made with ❤️ for developers who hate bugs
