import {expect, test, describe, it} from 'vitest'
import { RegisterUseCase } from './register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

describe ('Register Use Case', ()=>{
    it('should hash user password upon registration'), async () => {
        const prismaUsersRepository  = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(prismaUsersRepository )
        const {user} = await registerUseCase.execute({
            name :"Jon",
            email :"j@j.com",
            password :"123"
        })

        console.log(user.password_hash)
    }
})