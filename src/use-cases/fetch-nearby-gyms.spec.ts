import { expect, describe, it, beforeEach, vi, afterEach} from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyUseCase } from './fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyUseCase

describe('Fetch nearby gyms', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyUseCase(gymsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to fetch nearby gyms', async () => {

        await gymsRepository.create({
            title: "Near Gym",
            description: null,
            phone: null,
            latitude: -16.7280344,
            longitude: -43.8566138,
        })

        await gymsRepository.create({
            title: "Far Gym",
            description: null,
            phone: null,
            latitude: -16.3233322,
            longitude: -43.7057032,
        })

        const { gyms } = await sut.execute({
            userLatitude:-16.7305543,
            userLongitude:-43.873252
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })
}
)