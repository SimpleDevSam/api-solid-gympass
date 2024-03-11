import { FastifyInstance } from "fastify";
import { register } from "@/http/controllers/users/register";
import { verifyJWT } from "../../middlewares/verify-jwt";


export async function  gymRoutes(app: FastifyInstance) {
    app.addHook('onRequest',verifyJWT)
}