// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      session_id: string;
      ceated_at: string;
      updated_at: string;
    };

    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date: string;
      is_on_diet: boolean;
      ceated_at: string;
      updated_at: string;
    };
  }
}
