import { Cafe } from '@core/cafe/cafe.entity';
import { Tag } from '@core/tag/tag.entity';
import { BaseElementEntity } from '@global/entities';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post extends BaseElementEntity {
  @Column()
  content: string;

  @Column()
  author: string;

  @ManyToOne(type => Cafe, cafe => cafe.post, { eager: false })
  cafe: Cafe;

  @ManyToOne(type => Tag, tag => tag.post, { eager: false })
  tag: Tag;
}
