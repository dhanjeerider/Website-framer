# MockupGen AI

Next.js static export application for Cloudflare Pages.

## 🚀 Deployment to Cloudflare Pages

### Build Settings

In your Cloudflare Pages project settings, use:

- **Build command**: `npm run build && npm run export`
- **Build output directory**: `out`
- **Root directory**: `/` (leave empty)
- **Framework preset**: Next.js (Static HTML Export)

### Environment Variables

Add these in Cloudflare Pages → Settings → Environment variables:

```
GOOGLE_API_KEY=your_api_key_here
```

⚠️ **Never commit API keys to the repository**

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build and export for production
npm run deploy
```

## 📁 Project Structure

```
/workspaces/Website-framer/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── public/           # Static assets
├── next.config.js    # Next.js configuration
├── wrangler.toml     # Cloudflare Pages configuration
└── package.json      # Dependencies and scripts
```

## 🔧 Technical Details

- **Framework**: Next.js 14 (Static Export)
- **Hosting**: Cloudflare Pages
- **Node Version**: 18+
- **Package Manager**: npm

## 📝 Notes

- This project uses Next.js static export (no server-side features)
- All API calls must be client-side or use Cloudflare Workers
- Images are unoptimized for static export compatibility
