import { MongoClient } from 'mongodb';

const {
  MONGO_URI = 'mongodb+srv://admin:<password>@testcluster.a4nc919.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster',
} = process.env;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();