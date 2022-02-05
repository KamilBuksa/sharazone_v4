import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({type:'bigint'})
    id?: number;

    @Column(
        {type:'bigint', nullable:true})
    userId:  number;

    @Column(/*{type:"varchar"}*/)
    readonly username: string;

    @Column()
    readonly password: string;

}