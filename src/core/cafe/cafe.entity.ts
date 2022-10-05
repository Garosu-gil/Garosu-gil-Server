import { Category } from '@core/catagory/catagory.entity';
import { Post } from '@core/post/post.entity';
import { BaseElementEntity } from '@global/entities';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cafe extends BaseElementEntity {
  @Column()
  title: string;

  @Column()
  explanation: string;

  @OneToMany(type => Post, post => post.cafe, { eager: true })
  post: Post[];

  @ManyToOne(type => Category, category => category.cafe, { eager: false })
  category: Category;
}
