import express from 'express';
import routes from "./routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the Notification Service!');
})

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
