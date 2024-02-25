import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsUseCaseRequest {
    userId: string
    page:number
}

interface FetchUserCheckInsUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
    constructor(
        private checkInsRepository: ICheckInsRepository,
    ) { }

    async execute({
        userId,
        page,
    }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {

        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

        return {
            checkIns,
        }
    }
}