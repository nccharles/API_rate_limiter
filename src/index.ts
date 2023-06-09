import express from 'express';
import routes from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs',  swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v3', routes);

if (process.env.NODE_ENV !== 'test' && cluster.isMaster) {
    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    app.listen(process.env.PORT || 3000);
}

export default app;
