import express from 'express';

const app = express();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to sms and email notification service!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});