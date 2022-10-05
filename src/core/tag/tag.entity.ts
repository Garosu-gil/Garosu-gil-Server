import { Post } from '@core/post/post.entity';
import { BaseElementEntity } from '@global/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag extends BaseElementEntity {
  @Column()
  name: string;

  @OneToMany(type => Post, post => post.tag, { eager: true })
  post: Post[];
}
