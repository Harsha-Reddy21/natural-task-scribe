# Natural Task Scribe

A React application that converts natural language task descriptions into structured task data using OpenAI's API.

## Project info

**URL**: https://lovable.dev/projects/0f74ef91-280f-49ee-aa88-d3d41bbf6b47

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- OpenAI API key

## Environment Setup

1. Create a `.env` file in the root directory
2. Add the following environment variables:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-3.5-turbo  # Optional - defaults to gpt-3.5-turbo
```

## Installation and Setup

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd natural-task-scribe
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables as described above

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/lib` - Utility functions and API clients
  - `/pages` - Page components
  - `/hooks` - Custom React hooks

## Technologies Used

This project is built with:

- Vite - Build tool and development server
- TypeScript - Type-safe JavaScript
- React - UI framework
- shadcn-ui - UI component library
- Tailwind CSS - Utility-first CSS framework
- OpenAI API - Natural language processing
- React Query - Server state management
- React Router - Client-side routing

## Development

The project uses several modern development tools:

- ESLint for code linting
- TypeScript for type checking
- Vite for fast development and optimized builds

Available npm scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

Simply open [Lovable](https://lovable.dev/projects/0f74ef91-280f-49ee-aa88-d3d41bbf6b47) and click on Share -> Publish.

## Custom Domain Setup

Yes, you can connect a custom domain!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Security Note

⚠️ The current implementation uses the OpenAI API key directly in the browser. For production use, it's recommended to proxy these requests through a backend server to protect your API key.

## Contributing

There are several ways to contribute to this project:

**Use Lovable**
Simply visit the [Lovable Project](https://lovable.dev/projects/0f74ef91-280f-49ee-aa88-d3d41bbf6b47) and start prompting.
Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**
Clone the repo and push changes. Pushed changes will also be reflected in Lovable.

**Edit directly in GitHub**
- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon)
- Make your changes and commit

**Use GitHub Codespaces**
- Click on the "Code" button
- Select "Codespaces"
- Click "New codespace"
- Edit and commit your changes
