# Natural Task Scribe

A React application that converts natural language task descriptions into structured task data using OpenAI's API.

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
git clone <'https://github.com/Harsha-Reddy21/natural-task-scribe'>
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



