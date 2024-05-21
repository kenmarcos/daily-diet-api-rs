import { execSync } from "child_process";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import request from "supertest";

describe("Meals routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: true,
      })
      .expect(201);
  });

  it("should be able to list all meals from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: true,
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Churrasco",
        description: "Carne, linguiça, frango",
        date: "2024-05-22T19:00:00.000Z",
        isOnDiet: false,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookies!)
      .expect(200);

    expect(listMealsResponse.body.meals).toHaveLength(2);

    expect(listMealsResponse.body.meals[0].name).toBe("Sanduíche");
    expect(listMealsResponse.body.meals[1].name).toBe("Churrasco");
  });

  it("should be able to get a meal by id", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: true,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get(`/meals`)
      .set("Cookie", cookies!)
      .expect(200);

    const getMealResponse = await request(app.server)
      .get(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set("Cookie", cookies!)
      .expect(200);

    expect(getMealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
      }),
    });
  });

  it("should be able to delete a meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: true,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get(`/meals`)
      .set("Cookie", cookies!)
      .expect(200);

    await request(app.server)
      .delete(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set("Cookie", cookies!)
      .expect(204);
  });

  it("should be able to update a meal", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche",
        description:
          "Sanduíche de pão integral com atum e salada de alface e tomate",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: true,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get(`/meals`)
      .set("Cookie", cookies!)
      .expect(200);

    await request(app.server)
      .put(`/meals/${listMealsResponse.body.meals[0].id}`)
      .set("Cookie", cookies!)
      .send({
        name: "Sanduíche Top",
        description: "Sanduíche gorduroso",
        date: "2024-05-21T19:00:00.000Z",
        isOnDiet: false,
      })
      .expect(204);
  });

  it("should be able to get metrics from a user", async () => {
    const createUserResponse = await request(app.server)
      .post("/users")
      .send({ name: "John Doe", email: "johndoe@gmail.com" })
      .expect(201);

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Breakfast",
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date("2021-01-01T08:00:00"),
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Lunch",
        description: "It's a lunch",
        isOnDiet: false,
        date: new Date("2021-01-01T12:00:00"),
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Snack",
        description: "It's a snack",
        isOnDiet: true,
        date: new Date("2021-01-01T15:00:00"),
      })
      .expect(201);

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Dinner",
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date("2021-01-01T20:00:00"),
      });

    await request(app.server)
      .post("/meals")
      .set("Cookie", cookies!)
      .send({
        name: "Breakfast",
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date("2021-01-02T08:00:00"),
      });

    const getMetricsResponse = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookies!)
      .expect(200);

    expect(getMetricsResponse.body).toEqual({
      totalMeals: 5,
      totalMealsOnDiet: 4,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 3,
    });
  });
});
