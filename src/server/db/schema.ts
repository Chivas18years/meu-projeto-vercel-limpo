import { relations, sql } from "drizzle-orm";
import { index, primaryKey, sqliteTableCreator, text, integer } from "drizzle-orm/sqlite-core";
// import { type AdapterAccount } from "next-auth/adapters"; // Temporariamente comentado para script createAdmin

export const createTable = sqliteTableCreator((name) => `clonacao-cnh-facil_${name}`);

// Tabela para configurações do PIX
export const pixConfigs = createTable(
  "pix_config",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pixKey: text("pix_key").notNull(),
    pixValue: text("pix_value"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  }
);

// Tabela para dados dos clientes
export const clients = createTable(
  "client",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name", { length: 256 }).notNull(),
    cpf: text("cpf", { length: 14 }).notNull().unique(),
    birthDate: text("birth_date").notNull(),
    email: text("email", { length: 255 }).notNull(),
    phone: text("phone", { length: 20 }).notNull(),
    cnhType: text("cnh_type"),
    cnhCategory: text("cnh_category"),
    address: text("address"),
    cep: text("cep", { length: 9 }),
    uf: text("uf", { length: 2 }),
    city: text("city"),
    ipAddress: text("ip_address"),
    serviceRequested: text("service_requested"),
    paymentStatus: text("payment_status").default("pending"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("client_email_idx").on(table.email),
    cpfIdx: index("client_cpf_idx").on(table.cpf),
  })
);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }),
    createdById: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ]
);

export const users = createTable("user", (d) => ({
  id: d
    .text({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.text({ length: 255 }),
  email: d.text({ length: 255 }).notNull().unique(),
  emailVerified: d.integer({ mode: "timestamp" }).default(sql`(unixepoch())`),
  image: d.text({ length: 255 }),
  role: text("role").default("user").notNull(),
  hashedPassword: text("hashed_password"),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  posts: many(posts),
  sessions: many(sessions),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    // type: d.text({ length: 255 }).$type<AdapterAccount["type"]>().notNull(), // Temporariamente comentado
    type: d.text({ length: 255 }).notNull(), // Simplificado para o script
    provider: d.text({ length: 255 }).notNull(),
    providerAccountId: d.text({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text({ length: 255 }),
    scope: d.text({ length: 255 }),
    id_token: d.text(),
    session_state: d.text({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.text({ length: 255 }).notNull().primaryKey(),
    userId: d
      .text({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [index("session_userId_idx").on(t.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.text({ length: 255 }).notNull(),
    token: d.text({ length: 255 }).notNull(),
    expires: d.integer({ mode: "timestamp" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

