import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { ValidateCheckinUseCase } from "../validate-checkin"

export function makeValidateCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository
    const useCase = new ValidateCheckinUseCase(checkInsRepository)

    return useCase
}