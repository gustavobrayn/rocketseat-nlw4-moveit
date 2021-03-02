import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, Db } from "mongodb";

interface User {
  email: string;
  name: string;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

let cachedDb: Db = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = new URL(uri).pathname.substr(1);

  const db = client.db(dbName);

  cachedDb = db;

  return db;
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<Promise<User>>
) => {
  const { method } = request;
  const { email } = request.query;

  const db = await connectToDatabase(process.env.MONGODB_URI);
  const collection = db.collection("users");

  switch (method) {
    case "GET":
      const user = await collection.findOne({ email });

      return response.json(user);

    case "PUT":
      const { level, currentExperience, challengesCompleted } = request.body;

      await collection.findOneAndUpdate(
        {
          email,
        },
        {
          $set: { level, currentExperience, challengesCompleted },
        }
      );

      return response.status(200);
  }
};
