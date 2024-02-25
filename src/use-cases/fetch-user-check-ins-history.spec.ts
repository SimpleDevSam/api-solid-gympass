import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'


let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch check-in history Use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsUseCase(checkInsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to fetch check in history', async () => {

        await checkInsRepository.create({
            gymId: 'gym-01',
            user_id: 'user-01',
        })

        await checkInsRepository.create({
            gymId: 'gym-02',
            user_id: 'user-01',
        })

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 1

        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: 'gym-01' }),
            expect.objectContaining({ gymId: 'gym-02' }),
        ])
    })

    it('should be able to fetch paginated check in user history', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gymId: `gym-${i}`,
                user_id: `user-01`
            })
        }

        const { checkIns } = await sut.execute({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: 'gym-21' }),
            expect.objectContaining({ gymId: 'gym-22' }),
        ])

    })
}
)