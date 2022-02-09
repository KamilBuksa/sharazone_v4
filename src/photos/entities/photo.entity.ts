import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date

    @UpdateDateColumn({type:"timestamp", default:()=>"CURRENT_TIMESTAMP(6)", onUpdate:"CURRENT_TIMESTAMP(6)"})
    updatedAt:Date

    @Column({unique:true})
    title: string;

    @Column()
    lead: string;

    @Column()
    body: string;
}