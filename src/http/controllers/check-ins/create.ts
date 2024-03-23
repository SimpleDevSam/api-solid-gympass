import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-user-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {

    const createCheckinParamsSchema = z.object({
        gymId:z.string().uuid()
    });

    const createCheckinSchema = z.object({
        
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        }),

    });
    const { gymId } = createCheckinParamsSchema.parse(request.params);
    const { latitude, longitude } = createCheckinSchema.parse(request.body);
    const userId = request.user.sub

        const createCheckInUseCase = makeCheckInUseCase();
        await createCheckInUseCase.execute({
            gymId,
            userId,
            userLatitude:latitude,
            userLongitude:longitude
        })


    return reply.status(201).send();
}