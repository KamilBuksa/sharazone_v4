import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsDate, IsString} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({nullable:true, type:"date"})
    createdAt: string

    @Column({nullable:true, type:"date"})
    updatedAt: string

    @Column({nullable:true})
    email: string

    @Column({nullable:true})
    hash: string

    @Column({nullable:true})
    hashedRt?: string

}