import express from 'express';
import { ConfigurationConstants } from './config';

const app = express();

app.use(express.json());

app.get('/', (request: express.Request, response: express.Response) => {
    console.log(request);
    return response.status(234).send('Welcome!');
});

app.listen(ConfigurationConstants.PORT, () => {
    console.log(`App is listening to port: ${ConfigurationConstants.PORT}`);
});