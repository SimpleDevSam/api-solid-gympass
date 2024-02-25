import { expect, describe, it, beforeEach, vi, afterEach} from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'


let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: "title1",
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        })

        await gymsRepository.create({
            title: "title2",
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0,
        })

        const { gyms } = await sut.execute({
            query: 'title1',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'title1' }),
        ])
    })

    it('should be able to fetch paginated gym search', async () => {
        for (let i = 1; i <= 22; i++) {
          await gymsRepository.create({
            title: `JavaScript Gym ${i}`,
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091,
          })
        }
    
        const { gyms } = await sut.execute({
          query: 'JavaScript',
          page: 2,
        })
    
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
          expect.objectContaining({ title: 'JavaScript Gym 21' }),
          expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ])
      })
}
)