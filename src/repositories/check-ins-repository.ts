import { CheckinUseCase } from "@/use-cases/check-in";
import { CheckIn, Prisma } from "@prisma/client";

export interface ICheckInsRepository {
    create(data:Prisma.CheckInUncheckedCreateInput) : Promise <CheckIn>
    findById(checkinId:string) : Promise<CheckIn | null> 
    findByUserIdOnDate(userId:string , date:Date) : Promise <CheckIn | null>
    findManyByUserId(userId:string, page:number): Promise<Array<CheckIn>>
    countByUserId(userId:string): Promise<number>
    save(data:CheckIn):Promise<CheckIn>
}