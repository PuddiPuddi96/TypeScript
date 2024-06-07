import express, { Request, Response } from 'express';
import {
  httpSignIn,
  httpSignOut,
  httpSignUp,
} from './controllers/users.controller';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (request: Request, response: Response) => {
  response.send('Hello, TypeScript + Node.js + Express!');
});

app.get('/signup', httpSignUp);
app.get('/signin', httpSignIn);
app.get('/signout', httpSignOut);

app.all('*', () => {
  throw new Error('Catch me if you can');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
