import { CheckIn } from "@prisma/client";
import { ICheckInsRepository } from "@/repositories/check-ins-repository";
import { IGymsRepository } from "@/repositories/gyms-repository";
import { ResourcesNotExistError } from "./errors/resource-not-exists";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckinsError } from "./errors/max-number-of-check-ins-error";

interface CheckinUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckinUseCaseResponse {
    checkIn: CheckIn
}

export class CheckinUseCase {
    constructor(
        private checkInsRepository: ICheckInsRepository,
        private gymsRepository: IGymsRepository,
    ) { }

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourcesNotExistError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )
        
        
        const max_distance_in_kilometers = 0.1;

        if (distance>max_distance_in_kilometers) {
            throw new MaxDistanceError()
        }

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if (checkInOnSameDay) {
            throw new MaxNumberOfCheckinsError()
        }

        const checkIn = await this.checkInsRepository.create({
            gymId,
            user_id: userId

        })

        return {
            checkIn,
        }
    }
}