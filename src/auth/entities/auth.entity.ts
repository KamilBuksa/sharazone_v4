import {
  Column,
  CreateDateColumn,
  Entity,
  Index, JoinColumn,
  JoinTable, ManyToMany,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Article } from '../../articles/entities/article.entity';

//rozdzerzenie klasy Base
@Entity()
export class Auth {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;

  @Index('email')
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  hashedRt: string;

  @OneToMany(
    () => Article,
    (article) => article.auth,
    // { cascade: true },
  )
  articles: Article[];

//   addArticle(article: Article) {
//     if (this.articles == null) {
//       this.articles = new Array<Article>();
//     }
//     this.articles.push(article);
//   }
}



