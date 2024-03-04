import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { ValidateCheckinUseCase } from './validate-checkin'
import { ResourcesNotExistError } from './errors/resource-not-exists'
import { vi } from 'vitest'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'


let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckinUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkinId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkinId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourcesNotExistError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {

    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-01',
      user_id: 'user-01',
    })

    const tentyOneMinutesinMs = 1000 * 60 * 21

    vi.advanceTimersByTime(tentyOneMinutesinMs)

    const { checkIn } = await sut.execute({
      checkinId: createdCheckIn.id,
    })
    await expect(() =>
      sut.execute({
        checkinId: checkIn?.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})