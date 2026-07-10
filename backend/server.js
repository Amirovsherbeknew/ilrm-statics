const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const stageRoutes = require('./routes/stages');
const mechanismRoutes = require('./routes/mechanisms');

const app = express();
const PORT = process.env.PORT || 3001;
const dbPath = path.join(__dirname, 'db.json');
const uploadsPath = path.join(__dirname, 'uploads');

const router = jsonServer.router(dbPath);
app.locals.db = router.db;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsPath));

app.use('/api', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/mechanisms', mechanismRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Mock backend is running on port ${PORT}`);
});
