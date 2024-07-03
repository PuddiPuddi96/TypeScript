import { Request, Response, NextFunction } from 'express';
import { Todo, TodoWithId, Todos } from './todos.model';
import { InsertOneResult } from 'mongodb';

export async function findAll(req: Request, res: Response<TodoWithId[]>, next: NextFunction) {
  try {
    const todos = await Todos.find().toArray();
    res.json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, InsertOneResult, Todo>, res: Response<InsertOneResult>, next: NextFunction) {
  try {
    const validateResult = Todo.parse(req.body);
    const insertResult = await Todos.insertOne(validateResult);
    res.json(insertResult);
  } catch (error) {
    next(error);
  }
}
