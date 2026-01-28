# Naveen Patidar - Portfolio Website

A modern, responsive portfolio website built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Dark/Light Mode** toggle
- **Responsive Design** for all devices
- **API Routes** for backend functionality
- **Contact Form** with validation
- **Blog System** with dynamic routes
- **Admin Panel** for content management

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Icons
- Flowbite React
- EmailJS

### Backend Features
- Next.js API Routes
- RESTful API endpoints
- Contact form processing
- Project management API

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── contact/       # Contact form API
│   │   └── projects/      # Projects API
│   ├── blogs/             # Blog pages
│   ├── contact/           # Contact page
│   ├── education/         # Education page
│   ├── experience/        # Experience page
│   ├── projects/          # Projects page
│   ├── skills/            # Skills page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   └── views/             # Page views
├── public/                # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dev-Naveen PatidarK/dev-Naveen PatidarK.github.io.git
cd dev-Naveen PatidarK.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Build and deploy to GitHub Pages

## 🌐 API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects?featured=true` - Get featured projects
- `POST /api/projects` - Create new project (Admin)

## 🎨 Customization

### Theme Configuration
The website supports both light and dark themes. Theme preferences are saved in localStorage and applied automatically.

### Adding New Projects
You can add new projects via the API or by directly modifying the projects data in `/app/api/projects/route.ts`.

### Styling
All styles use Tailwind CSS. Custom styles can be added to `app/globals.css`.

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🔧 Backend Integration

This portfolio now includes backend functionality through Next.js API routes:

- **Contact Form**: Processes contact submissions
- **Project Management**: API for managing portfolio projects
- **Admin Features**: Protected routes for content management

## 🚀 Deployment

### GitHub Pages
```bash
npm run deploy
```

### Vercel (Recommended for full features)
1. Connect your GitHub repository to Vercel
2. Deploy automatically with git pushes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

**Naveen Patidar**
- Email: [your.email@example.com](mailto:your.email@example.com)
- LinkedIn: [your-linkedin-profile](https://linkedin.com/in/your-profile)
- GitHub: [dev-Naveen PatidarK](https://github.com/dev-Naveen PatidarK)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- All open source contributors

---

**Note**: This project has been successfully converted from Vite + React to Next.js 14 with TypeScript, adding full-stack capabilities including backend API routes for enhanced functionality.

Usable things

tsparticle react

https://github.com/tsparticles/react


sample portfolio:
https://github.com/ben04rogers/portfolio-v2

Webpage

https://www.benrogers.dev/


portfolios github

https://github.com/emmabostian/developer-portfolios?tab=readme-ov-file


for Project headings
https://www.grimfunky.dev/


https://getof.net/


https://stephanemonnot.com/