import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'


describe('Check In History (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list check-ins', async () => {

        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: "JavaScript Gym",
                latitude: -27.012012,
                longitude: -49.812398

            }
        })

        const checkIns = await prisma.checkIn.createMany({
            data: [{
                gymId: gym.id,
                user_id: user.id
            },
            {
                gymId: gym.id,
                user_id: user.id
            }
            ]
        })

        const response = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send()
        expect(response.statusCode).toEqual(200)
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gymId: gym.id,
                user_id: user.id
            }),
            expect.objectContaining({
                gymId: gym.id,
                user_id: user.id
            }),
        ])
    })
})