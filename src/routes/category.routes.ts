import type { FastifyInstance } from "fastify";
import { getCategories } from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleare.js";


const categoryRoutes = async (fastify:FastifyInstance):Promise<void> => {
    fastify.addHook('preHandler', authMiddleware)
    
    fastify.get('/', getCategories)
}

export default categoryRoutes;