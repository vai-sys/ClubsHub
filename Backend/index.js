const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const authRoutes = require('./routes/authRoutes');
const clubRoutes=require('./routes/clubRoutes')
const eventRoutes=require('./routes/eventRoutes')
const announcement=require('./routes/announcementRoutes')
const competition=require('./routes/competitionRoutes')

const app = express();

connectDB();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
  origin: 'https://clubs-hub.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(require('cookie-parser')());

app.use('/api/auth', authRoutes);
app.use('/api/club',clubRoutes)
app.use('/api/event',eventRoutes)
app.use('/api/announcement',announcement);
app.use('/api/competition',competition)



app.get('/', (req, res) => {
  res.send('hii there');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});