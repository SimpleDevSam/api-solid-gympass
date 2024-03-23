import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourcesNotExistError } from "./errors/resource-not-exists";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

interface ValidateCheckinUseCaseRequest {
    checkInId:string
}

interface ValidateCheckinUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckinUseCase {
    constructor(
        private checkInsRepository: ICheckInsRepository,
    ) { }

    async execute({
        checkInId
    }: ValidateCheckinUseCaseRequest): Promise<ValidateCheckinUseCaseResponse> {

        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourcesNotExistError()
        }

        const distanceInMinutesfromCheckinCreation = dayjs(new Date()).diff (
            checkIn.created_at,
            'minutes',
        )
            
        if (distanceInMinutesfromCheckinCreation > 20 ) {
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn,
        }
    }
}