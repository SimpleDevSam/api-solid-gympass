import fastify from "fastify";
import { userRoutes } from "./http/controllers/users/routes";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { ZodError } from "zod";
import  fastifyCookie  from "@fastify/cookie";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";

export const app = fastify();

app.register(fastifyJwt,{
    secret:env.JWT_SECRET,
    cookie:{
        cookieName:"refreshToken",
        signed:false
    },
    sign:{
        expiresIn:'10m'
    }
})

app.register(fastifyCookie);

app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error,_,reply)=> {
    if (error instanceof ZodError) {
        return reply
        .status(400)
        .send({message: 'Validation error.', issues : error.format()})
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        //TODO: here we shoud log to an external tool like Datadog/NewRelic/Sentry
    }

    return reply.status(500).send({message: 'Internal server error'});
})

