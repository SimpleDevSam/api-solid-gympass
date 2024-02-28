import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { CheckinUseCase } from "../check-in"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"

export function makeCheckInUseCase() {
    
    const checkInRepository = new PrismaCheckInsRepository()
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new CheckinUseCase(checkInRepository,gymsRepository)

    return useCase
}