import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { newDb } from "pg-mem";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

function createDemoPool(): Pool {
  const memory = newDb({ autoCreateForeignKeyIndices: true });
  memory.public.none(`
    CREATE TABLE users (
      id serial PRIMARY KEY, email text NOT NULL UNIQUE, name text NOT NULL,
      password_hash text NOT NULL, role_title text NOT NULL DEFAULT 'Filmmaker',
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE favourites (
      id serial PRIMARY KEY, user_id integer NOT NULL DEFAULT 1, slug text NOT NULL,
      title text NOT NULL, category text NOT NULL, accent text,
      department text NOT NULL DEFAULT 'cinematography', created_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT favourites_user_slug_uniq UNIQUE (user_id, slug)
    );
    CREATE TABLE shots (
      id serial PRIMARY KEY, user_id integer NOT NULL DEFAULT 1, title text, size text,
      angle text, movement text, lens text, framerate text, support text, audio text,
      lighting text, description text, priority integer NOT NULL DEFAULT 2,
      completed boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0,
      department text NOT NULL DEFAULT 'cinematography', created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE user_profiles (
      id serial PRIMARY KEY, user_id integer NOT NULL DEFAULT 1 UNIQUE,
      primary_department text NOT NULL DEFAULT 'cinematography', secondary_departments text NOT NULL DEFAULT '[]',
      work_types text NOT NULL DEFAULT '[]', experience_level text NOT NULL DEFAULT 'working-professional',
      active_department text NOT NULL DEFAULT 'cinematography', completed_onboarding boolean NOT NULL DEFAULT false,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE projects (
      id serial PRIMARY KEY, owner_user_id integer NOT NULL DEFAULT 1, title text NOT NULL,
      project_type text NOT NULL DEFAULT 'narrative', description text, status text NOT NULL DEFAULT 'prep',
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE project_crew (
      id serial PRIMARY KEY, project_id integer NOT NULL, user_id integer, name text NOT NULL,
      role text NOT NULL, department text NOT NULL, contact text, notes text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE project_items (
      id serial PRIMARY KEY, project_id integer NOT NULL, creator_user_id integer NOT NULL DEFAULT 1,
      item_type text NOT NULL, title text NOT NULL, content text, department text NOT NULL,
      shared_with text NOT NULL DEFAULT '["all"]', updated_by text,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  const adapter = memory.adapters.createPg();
  const originalQuery = adapter.Pool.prototype.query;
  adapter.Pool.prototype.query = function (this: InstanceType<typeof adapter.Pool>, query: unknown, ...args: unknown[]) {
    if (query && typeof query === "object" && "rowMode" in query && query.rowMode === "array") {
      const compatibleQuery = { ...(query as Record<string, unknown>) };
      delete compatibleQuery.rowMode;
      delete compatibleQuery.types;
      return Promise.resolve(originalQuery.call(this, compatibleQuery, ...args)).then((result) => ({
        ...result,
        rows: result.rows.map((row: Record<string, unknown>) => Object.values(row)),
      }));
    }
    return originalQuery.call(this, query, ...args);
  } as typeof originalQuery;
  return new adapter.Pool() as unknown as Pool;
}

export const pool = globalForDb.__arenaNextJsPostgresqlPool ??
  (databaseUrl ? new Pool({ connectionString: databaseUrl }) : createDemoPool());

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
