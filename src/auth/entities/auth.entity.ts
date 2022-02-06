import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {IsString} from "class-validator";

@Entity()
export class Auth {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({unique: true})
    email: string;

    // @Index()
    // @Column(/*{unique:true}*/)
    // password: string;

    @Column({nullable: true})
    hash: string

    @Column({nullable: true})
    hashedRt?: string

    @CreateDateColumn({type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date

    @UpdateDateColumn({type:"timestamp", default:()=>"CURRENT_TIMESTAMP(6)", onUpdate:"CURRENT_TIMESTAMP(6)"})
    updatedAt:Date

}
