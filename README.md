<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1P2U0glPeEgibAf6z7zDIqqWo7GAVUSn-

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# MockupGen AI

An AI-powered mockup generation tool built with React and Google's Generative AI.

## Features

- Generate mockups using AI
- Modern React interface
- Responsive design
- TypeScript support

## Development

### Prerequisites

- Node.js 18+ or Bun
- Git

### Local Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mockupgen-ai
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Start development server:
```bash
bun dev
# or
npm run dev
```

4. Build for production:
```bash
bun run build
# or
npm run build
```

## Deployment

### Cloudflare Pages Deployment

This project is optimized for deployment on Cloudflare Pages.

#### Automatic Deployment (Recommended)

1. **Connect Repository:**
   - Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to **Workers & Pages** → **Create Application** → **Pages**
   - Click **Connect to Git** and select your GitHub repository

2. **Configure Build Settings:**
   - **Framework preset:** None (or Vite)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (default)

3. **Environment Variables:**
   If your app uses environment variables, add them in the Cloudflare Pages dashboard under **Settings** → **Environment Variables**.

4. **Deploy:**
   - Click **Save and Deploy**
   - Cloudflare will automatically build and deploy your site
   - Future pushes to your main branch will trigger automatic deployments

#### Manual Deployment

1. Build the project locally:
```bash
npm run build
```

2. Use Wrangler CLI:
```bash
# Install Wrangler if you haven't
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages publish dist --project-name=mockupgen-ai
```

#### Build Configuration

The project includes:
- **Redirects:** `_redirects` file for SPA routing
- **Build output:** Configured for `dist` directory
- **Static assets:** Properly handled by Vite

#### Troubleshooting

- **Build fails:** Check that all dependencies are listed in `package.json`
- **404 errors:** Ensure `_redirects` file is in the `public` directory
- **Environment variables:** Add any required env vars in Cloudflare Pages settings

### Other Deployment Options

- **Vercel:** Import repository and deploy with zero configuration
- **Netlify:** Drag and drop the `dist` folder or connect via Git
- **GitHub Pages:** Use GitHub Actions for automated deployment

## Project Structure

```
mockupgen-ai/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/
│   └── _redirects       # SPA routing configuration
├── dist/                # Build output (generated)
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Google Generative AI** - AI capabilities
- **Lucide React** - Icons
- **Tailwind CSS** - Styling (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
