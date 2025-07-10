<div align="center">
  <h1>Memobase Inspector</h1>
  <p>
    	<img src="https://img.shields.io/badge/Memobase-Inspector-blue">
      <img src="https://img.shields.io/badge/license-MIT-green">
  </p>
  <p>
    <a href="https://app.memobase.io/inspector" > 
    	<img style="border-radius: 12px; width: 700px;" src="https://github.com/user-attachments/assets/42ad239f-8021-4319-a933-5298dfd45615">
    </a>
  </p>
</div>

A modern, feature-rich dashboard application built with Next.js 15 and React 19, designed for efficient management and analysis of MemoBase data. The project supports internationalization and cloud deployment.

## Features

- 🚀 Built with Next.js 15 and React 19
- 🌐 Internationalization with next-intl
- 🎨 Modern UI components using Radix UI
- 📊 Data visualization (e.g., Recharts)
- 🌙 Dark mode support (next-themes)
- 🔒 Authentication with Supabase
- 💳 Payment integration with Stripe
- 🎯 State management with Zustand
- 🎨 Styled with Tailwind CSS
- 🚢 Cloudflare deployment support

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Cloudflare account (for deployment)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd memobase-inspector
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the required environment variables.

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `pnpm dev` - Start the development server (Turbopack)
- `pnpm build` - Build the application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview Cloudflare build
- `pnpm deploy` - Deploy to Cloudflare
- `pnpm upload` - Upload build to Cloudflare
- `pnpm cf-typegen` - Generate Cloudflare environment types

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
├── messages/         # Internationalization messages
├── hooks/            # Custom React hooks
├── public/           # Static assets
├── api/              # API routes
└── utils/            # Business utilities
```

## Deployment

Deploy to Cloudflare with a single command:

```bash
pnpm deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is based on Memobase and follows its original license. Please refer to the original Memobase repository for license details.

## Support

For support, please open an issue in the repository.
