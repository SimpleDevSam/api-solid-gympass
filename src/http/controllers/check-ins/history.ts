import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { makeFetchUserCheckInsUseCase } from "@/use-cases/factories/make-fetch-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1)

    });

    const {  page } = checkInHistoryQuerySchema.parse(request.query);
    const userId = request.user.sub

    const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsUseCase();
    const {checkIns} = await fetchUserCheckInsHistoryUseCase.execute({
        userId,
        page
    })


    return reply.status(200).send({
        checkIns,
    });
}