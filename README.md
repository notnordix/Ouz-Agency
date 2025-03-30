# OUZ Agency Coming Soon Page

A modern, responsive coming soon page for OUZ Agency built with React and Material-UI.

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Header.jsx     # Main header component
│   ├── NewsletterForm.jsx  # Newsletter subscription form
│   └── SocialLinks.jsx     # Social media links
├── services/          # API and external service integrations
│   └── api.js        # API service functions
├── utils/            # Utility functions and configurations
│   └── theme.js      # Material-UI theme configuration
├── assets/           # Static assets (images, fonts, etc.)
└── App.jsx           # Main application component
```

## Features

- Modern, responsive design
- Newsletter subscription form
- Social media integration
- Smooth animations using Framer Motion
- Material-UI components and theming
- Form validation and error handling

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=your_api_url
```

## Technologies Used

- React
- Material-UI
- Framer Motion
- Axios
- React Intersection Observer
