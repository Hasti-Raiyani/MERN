const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const server = app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const fallback = PORT + 1;
        console.warn(`⚠️  Port ${PORT} in use, trying port ${fallback}...`);
        app.listen(fallback, () =>
          console.log(`🚀 Server running on http://localhost:${fallback}`)
        );
      } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
      }
    });
  })
  .catch((err) => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });
