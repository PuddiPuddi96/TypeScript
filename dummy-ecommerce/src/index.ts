import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/error';

const app: Express = express();

app.use(express.json());

// app.get('/', (request: Request, response: Response) => {
//     console.log(request);
//     return response.status(234).send('Welcome!');
// });

app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
    log:['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (address) => {
                    return `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.country}, ${address.pincode} `
                }
            }
        }
    }
})

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`);
});