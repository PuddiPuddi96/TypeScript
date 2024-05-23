import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';

const app: Express = express();

app.use(express.json());

// app.get('/', (request: Request, response: Response) => {
//     console.log(request);
//     return response.status(234).send('Welcome!');
// });

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
})

app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
});