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

  app.get("/", async (request, reply) => {
    const meals = await knex("meals").where("user_id", request.user?.id);

    return reply.send({
      meals,
    });
  });

  app.get("/:id", async (request, reply) => {
    const getSpecificMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getSpecificMealParamsSchema.parse(request.params);

    const mealById = await knex("meals").where("id", id).first();

    if (!mealById) {
      return reply.status(404).send({
        message: "Meal not found",
      });
    }

    return reply.send({
      meal: mealById,
    });
  });

  app.put("/:id", async (request, reply) => {
    const editMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    });

    const editMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = editMealParamsSchema.parse(request.params);

    const { name, description, date, isOnDiet } = editMealBodySchema.parse(
      request.body
    );

    const mealById = await knex("meals").where("id", id).first();

    if (!mealById) {
      return reply.status(404).send({
        message: "Meal not found",
      });
    }

    await knex("meals").where("id", id).update({
      name,
      description,
      date: date.toISOString(),
      is_on_diet: isOnDiet,
    });

    return reply.status(204).send();
  });

  app.delete("/:id", async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteMealParamsSchema.parse(request.params);

    const mealById = await knex("meals").where("id", id).first();

    if (!mealById) {
      return reply.status(404).send({
        message: "Meal not found",
      });
    }

    await knex("meals").where("id", id).delete();

    return reply.status(204).send();
  });

  app.get("/metrics", async (request, reply) => {
    const totalMeals = await knex("meals")
      .where("user_id", request.user?.id)
      .orderBy("date", "desc");

    const totalMealsOnDiet = await knex("meals")
      .where({
        user_id: request.user?.id,
        is_on_diet: true,
      })
      .count("id", { as: "total" })
      .first();

    const totalMealsOffDiet = await knex("meals")
      .where({
        user_id: request.user?.id,
        is_on_diet: false,
      })
      .count("id", { as: "total" })
      .first();

    const { bestOnDietSequence } = totalMeals.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.currentSequence += 1;
        } else {
          acc.currentSequence = 0;
        }

        if (acc.bestOnDietSequence < acc.currentSequence) {
          acc.bestOnDietSequence = acc.currentSequence;
        }

        return acc;
      },
      { bestOnDietSequence: 0, currentSequence: 0 }
    );

    return reply.send({
      totalMeals: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet?.total,
      totalMealsOffDiet: totalMealsOffDiet?.total,
      bestOnDietSequence,
    });
  });
};
