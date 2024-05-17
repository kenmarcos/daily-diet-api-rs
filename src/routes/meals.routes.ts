import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export const mealsRoutes = async (app: FastifyInstance) => {
  app.addHook("preHandler", checkSessionIdExists);

  app.post("/", async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    });

    const { name, description, date, isOnDiet } = createMealBodySchema.parse(
      request.body
    );

    await knex("meals").insert({
      id: randomUUID(),
      user_id: request.user?.id,
      name,
      description,
      date: date.toISOString(),
      is_on_diet: isOnDiet,
    });

    return reply.status(201).send();
  });
};