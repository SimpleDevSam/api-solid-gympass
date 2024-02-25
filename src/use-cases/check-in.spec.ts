import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckinsError } from './errors/max-number-of-check-ins-error'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Register Use Case', () => {


  beforeEach( async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Js Gym',
      description: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: ''
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: 'sa',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: 'sa',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() => sut.execute({
      gymId: "gym-01",
      userId: 'sa',
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(MaxNumberOfCheckinsError)
  })

  it('should  be able to check in twice but in different days', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: 'sa',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: 'sa',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in in a distant gym', async () => {

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Jss Gym',
      description: '',
      latitude: new Decimal(-16.7077048),
      longitude: new Decimal(-43.8513601),
      phone: ''
    })

    await expect(() => 
        sut.execute({
        gymId: "gym-02",
        userId: 'sa',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})