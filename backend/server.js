const app = require('./src/app');

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});