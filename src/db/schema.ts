import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  roleTitle: text("role_title").default("Filmmaker").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const favourites = pgTable(
  "favourites",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").default(1).notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    accent: text("accent"),
    department: text("department").default("cinematography").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("favourites_user_slug_uniq").on(t.userId, t.slug)]
);

export const shots = pgTable("shots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").default(1).notNull(),
  title: text("title"),
  size: text("size"),
  angle: text("angle"),
  movement: text("movement"),
  lens: text("lens"),
  framerate: text("framerate"),
  support: text("support"),
  audio: text("audio"),
  lighting: text("lighting"),
  description: text("description"),
  priority: integer("priority").default(2).notNull(),
  completed: boolean("completed").default(false).notNull(),
  position: integer("position").default(0).notNull(),
  department: text("department").default("cinematography").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").default(1).notNull().unique(),
  primaryDepartment: text("primary_department").default("cinematography").notNull(),
  secondaryDepartments: text("secondary_departments").default("[]").notNull(),
  workTypes: text("work_types").default("[]").notNull(),
  experienceLevel: text("experience_level").default("working-professional").notNull(),
  activeDepartment: text("active_department").default("cinematography").notNull(),
  completedOnboarding: boolean("completed_onboarding").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  ownerUserId: integer("owner_user_id").default(1).notNull(),
  title: text("title").notNull(),
  projectType: text("project_type").default("narrative").notNull(),
  description: text("description"),
  status: text("status").default("prep").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectCrew = pgTable("project_crew", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  contact: text("contact"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const projectItems = pgTable("project_items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  creatorUserId: integer("creator_user_id").default(1).notNull(),
  itemType: text("item_type").notNull(), // script, scene-breakdown, shooting-schedule, call-sheet, shot-list, locations, crew-contacts, production-notes, project-files, lighting-plan, sound-report, camera-report, continuity-note
  title: text("title").notNull(),
  content: text("content"),
  department: text("department").notNull(), // owner department
  sharedWith: text("shared_with").default('["all"]').notNull(), // JSON array of departments that can view
  updatedBy: text("updated_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
