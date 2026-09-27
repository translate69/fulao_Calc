import { pgTable, serial, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const hotpotMeals = pgTable(
  "hotpot_meals",
  {
    id: serial("id").primaryKey(),
    meal_id: varchar("meal_id", { length: 32 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    data: jsonb("data").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("hotpot_meals_meal_id_idx").on(table.meal_id),
  ]
);
