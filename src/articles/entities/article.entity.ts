import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';

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

    @ManyToOne(
      () => Auth,
      (auth) => auth.articles
    )
    auth:Auth

}