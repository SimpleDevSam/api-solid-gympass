import { IUsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourcesNotExistError } from "./errors/resource-not-exists";


interface GetUserProfileUseCaseRequest {
    userId:string,
}

interface GetUserProfileUseCaseResponse {
    user:User
}

export class GetUserProfileUseCase {
    constructor (private usersRepository:IUsersRepository) { }

    async execute ({userId}: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse>
 {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
        throw new ResourcesNotExistError()
    }

    return {
        
        user,
    }
 }
}