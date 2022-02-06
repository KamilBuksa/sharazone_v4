import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column()
    email:string;

    @Column()
    password: string;
}