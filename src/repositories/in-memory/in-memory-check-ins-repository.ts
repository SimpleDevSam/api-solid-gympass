import { randomUUID } from "node:crypto";
import { ICheckInsRepository } from "../check-ins-repository";
import { Prisma, CheckIn } from '@prisma/client'
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements ICheckInsRepository {

    public items: CheckIn[] = []

    async countByUserId(userId: string){
        return this.items.filter((item) => item.user_id === userId).length
    }

    async findManyByUserId(userid: string, page: number) {
        return this.items
            .filter((item) => item.user_id === userid)
            .slice((page - 1) * 20, page * 20)
    }

    async findByUserIdOnDate(userId: string, date: Date) {

        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');

        const checkOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at)
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
            return checkIn.user_id === userId && isOnSameDate
        })

        if (!checkOnSameDate) {
            return null
        }

        return checkOnSameDate
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.items.push(checkIn)

        return checkIn
    }
}