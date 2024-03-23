import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'


describe('User Metrics(e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get user metrics', async () => {

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
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send()
        expect(response.statusCode).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})