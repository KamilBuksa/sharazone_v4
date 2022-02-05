import {Column,Entity,PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    lead: string;

    @Column()
    body: string;
}