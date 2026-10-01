import app from './app.js';
import config from './config/config.js';

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏥 CarePoint HMS Backend Server is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Configured Frontend: ${config.frontendUrl}`);
  console.log(`📦 Database: Supabase PostgreSQL`);
  console.log(`====================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

export default server;
