import { FastifyInstance } from "fastify";
import { app } from "../app";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    const { name, email } = createUserBodySchema.parse(request.body);

    const userByEmail = await knex("users").where("email", email).first();

    if (userByEmail) {
      return reply.status(409).send({ message: "User already exists" });
    }

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
};
