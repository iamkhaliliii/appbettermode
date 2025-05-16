"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const db_1 = require("./db"); // Using Drizzle instance
const schema_1 = require("./db/schema");
const zod_1 = require("zod"); // Ensure ZodError is imported for typed error handling
const drizzle_orm_1 = require("drizzle-orm"); // eq and and are sufficient for these routes
// Zod schema for the payload when creating a new SITE
const createSitePayloadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: "Site name must be at least 2 characters." }),
    subdomain: zod_1.z.string()
        .min(3, { message: "Subdomain must be at least 3 characters." })
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Subdomain can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.",
    })
        .optional(), // Subdomain is optional; if provided, it's validated.
});
async function registerRoutes(app) {
    // Health check endpoint
    app.get("/api/health", (_req, res) => {
        res.status(200).json({ status: "ok", message: "Server is healthy" });
    });
    // --- Endpoint to GET sites for the current user ---
    app.get("/api/sites", async (req, res, next) => {
        try {
            // --- TODO: Replace with actual authenticated user ID (e.g., from req.user.id) ---
            const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
            // --------------------------------------------------------------------------------
            if (!currentUserId) {
                return res.status(401).json({ message: "User not authenticated." });
            }
            const userSites = await db_1.db
                .select({
                id: schema_1.sites.id,
                name: schema_1.sites.name,
                subdomain: schema_1.sites.subdomain,
                ownerId: schema_1.sites.owner_id,
                role: schema_1.memberships.role,
                createdAt: schema_1.sites.createdAt,
            })
                .from(schema_1.sites)
                .innerJoin(schema_1.memberships, (0, drizzle_orm_1.eq)(schema_1.memberships.siteId, schema_1.sites.id))
                .where((0, drizzle_orm_1.eq)(schema_1.memberships.userId, currentUserId))
                .orderBy(schema_1.sites.name); // Or sites.createdAt
            return res.status(200).json(userSites);
        }
        catch (error) {
            console.error("Error in GET /api/sites:", error);
            return next(error); // Pass to your centralized error handler
        }
    });
    // --- Endpoint to GET a specific site by ID or SUBDOMAIN ---
    app.get("/api/sites/:identifier", async (req, res, next) => {
        try {
            const { identifier } = req.params;
            if (!identifier) {
                return res.status(400).json({ message: "Site identifier is required." });
            }
            const site = await db_1.db.query.sites.findFirst({
                where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.sites.id, identifier), (0, drizzle_orm_1.eq)(schema_1.sites.subdomain, identifier)),
                // If you want to return all columns, you can omit the 'columns' option.
                // Otherwise, specify them like this:
                // columns: {
                //   id: true,
                //   name: true,
                //   subdomain: true,
                //   ownerId: true,
                //   createdAt: true,
                //   updatedAt: true,
                //   state: true,
                // },
            });
            if (!site) {
                return res.status(404).json({ message: "Site not found." });
            }
            return res.status(200).json(site);
        }
        catch (error) {
            console.error(`Error in GET /api/sites/${req.params.identifier}:`, error);
            return next(error); // Pass to your centralized error handler
        }
    });
    // --- Endpoint to CREATE a new SITE ---
    app.post("/api/sites", async (req, res, next) => {
        try {
            const validationResult = createSitePayloadSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    message: "Invalid site data.",
                    errors: validationResult.error.flatten().fieldErrors,
                });
            }
            const payload = validationResult.data;
            // --- TODO: Replace with actual authenticated user ID (e.g., from req.user.id) ---
            const currentUserId = "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d"; // Placeholder
            // ---------------------------------------------------------------------------------
            if (!currentUserId) {
                return res.status(401).json({ message: "User not authenticated for creating a site." });
            }
            // Optional: Check for subdomain uniqueness before hitting DB (DB constraint will also catch it)
            if (payload.subdomain) {
                const existingSiteWithSubdomain = await db_1.db.query.sites.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.sites.subdomain, payload.subdomain),
                });
                if (existingSiteWithSubdomain) {
                    return res.status(409).json({ message: "Subdomain is already taken." });
                }
            }
            const newSite = await db_1.db.transaction(async (tx) => {
                const siteInsertResult = await tx
                    .insert(schema_1.sites)
                    .values({
                    name: payload.name,
                    subdomain: payload.subdomain, // Will be null if optional and not provided
                    owner_id: currentUserId,
                })
                    .returning();
                if (!siteInsertResult || siteInsertResult.length === 0) {
                    throw new Error("Failed to create the site record in the database.");
                }
                const createdSite = siteInsertResult[0];
                // Automatically add the site creator as an 'admin' member
                await tx.insert(schema_1.memberships).values({
                    userId: currentUserId,
                    siteId: createdSite.id,
                    role: "admin", // Ensure 'admin' is a valid value in your memberRoleEnum in schema.ts
                });
                return createdSite;
            });
            return res.status(201).json(newSite);
        }
        catch (error) {
            console.error("Error in POST /api/sites:", error);
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({ message: "Validation error.", errors: error.flatten().fieldErrors });
            }
            // Check for PostgreSQL unique violation error (code 23505)
            if (typeof error === 'object' && error !== null && 'code' in error && String(error.code) === '23505') {
                // You might want to check error.constraint_name to be more specific if you have multiple unique constraints
                return res.status(409).json({ message: "A site with this subdomain or another unique identifier already exists." });
            }
            return next(error); // Pass to your centralized error handler
        }
    });
    // If you had other routes (like for events or discussions), they would go here.
    // For example:
    // app.post("/api/events", async (req, res, next) => { /* ... */ });
    // app.post("/api/discussions", async (req, res, next) => { /* ... */ });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
