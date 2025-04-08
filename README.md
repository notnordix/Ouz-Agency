# OUZ Agency Coming Soon Page

A modern, responsive coming soon page for OUZ Agency built with React and Material-UI.

## Project Structure

```
src/
├── components/         # Reusable React components
│   ├── AnimatedText.jsx     # Animated text component
│   ├── PlaceholdersAndVanishInput.jsx  # Input animation component
│   └── SandClock.jsx     # Sand clock animation component
├── services/          # API and external service integrations
├── utils/            # Utility functions and configurations
├── styles/           # Global styles and CSS
├── fonts/            # Custom fonts and typography
├── assets/           # Static assets (images, etc.)
├── App.jsx           # Main application component
└── index.jsx         # Application entry point
```

## Features

- Modern, responsive design
- Newsletter subscription form with database storage
- cPanel mailing list integration
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

## Server Setup

### Database Setup

1. Create a MySQL database using the provided `database.sql` file
2. The database will create a `subscribers` table for storing email subscriptions

### PHP Server Files

Place the following files on your PHP server:

- `subscribe.php` - Handles email subscription requests
- `cpanel.php` - Manages cPanel mailing list integration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration (Required)
# Set these to store subscribers in a database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_database_password
DB_NAME=ouz_agency

# cPanel Configuration (Optional)
# Set these if you want to add subscribers to cPanel mailing list
CPANEL_USER=your_cpanel_username
CPANEL_PASS=your_cpanel_password
CPANEL_DOMAIN=your_domain

# API Configuration
# Frontend API URL - don't change this unless you know what you're doing
REACT_APP_API_URL=http://localhost/ouz-agency/subscribe.php
```

## Technologies Used

- React
- Material-UI
- Framer Motion
- Axios
- React Intersection Observer
- PHP
- MySQL
- cPanel API (optional)

## Production Deployment

1. Build the React application:

   ```bash
   npm run build
   ```

2. Upload the `build` folder contents to your web server

3. Ensure PHP files are properly configured with correct database credentials

4. Set up proper CORS headers if frontend and backend are on different domains

5. Test the subscription system thoroughly in production environment

## Security Considerations

- Ensure database credentials are properly secured
- Implement rate limiting on the subscription endpoint
- Use HTTPS for all API communications
- Validate and sanitize all user inputs
- Keep PHP and MySQL versions up to date
