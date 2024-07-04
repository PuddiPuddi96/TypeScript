import { Router } from 'express';
import * as TodoHandlers from './todos.handlers';
import { Todo } from './todos.model';
import { validateRequest } from '../../middlewares';

const router = Router();

router.get('/', TodoHandlers.findAll);
router.post('/', validateRequest({ body: Todo }), TodoHandlers.createOne);

export default router;