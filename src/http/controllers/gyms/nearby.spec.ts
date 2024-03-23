import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'


describe('Nearby Gyms (e2e)', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {

        const { token } = await createAndAuthenticateUser(app,true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some Description',
                phone: "12131231",
                latitude: -16.7280344,
                longitude: -43.8566138,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some Description',
                phone: "12131231",
                latitude: -27.012012,
                longitude: -49.812398
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -27.012012,
                longitude: -49.812398
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            }),
        ])
    })
})