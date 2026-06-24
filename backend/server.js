const { connectDB } = require('./config/db');
const { seedIfEmpty } = require('./config/seedHelper');
const app = require('./app');

const startServer = async () => {
  // 1. Connect to Database (with memory-server auto-startup)
  await connectDB();

  // 2. Perform Automatic Database Seeding if empty
  await seedIfEmpty();

  // 3. Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
