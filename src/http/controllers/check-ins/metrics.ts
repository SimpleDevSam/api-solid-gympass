import { FastifyRequest, FastifyReply } from "fastify";
import { z } from 'zod'
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { makeFetchUserCheckInsUseCase } from "@/use-cases/factories/make-fetch-check-ins-history-use-case";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
    
    const userId = request.user.sub

    const getUserMetricsUseCase = makeGetUserMetricsUseCase();
    const {checkInsCount} = await getUserMetricsUseCase.execute({
        userId,
    })


    return reply.status(200).send({
        checkInsCount
    });
}