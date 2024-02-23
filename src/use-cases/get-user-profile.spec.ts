import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourcesNotExistError } from './errors/resource-not-exists'


let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe('Get user profile use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get profile', async () => {

        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: 'johndoe@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it('should not be able to get user profile with wrong id', async () => {

        expect(() =>
            sut.execute({
                userId: 'non-existing-id'
            })).rejects.toBeInstanceOf(ResourcesNotExistError)
    })
})