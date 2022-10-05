import { Cafe } from '@core/cafe/cafe.entity';
import { BaseElementEntity } from '@global/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseElementEntity {
  @Column()
  name: string;

  @OneToMany(() => Cafe, cafe => cafe.category, { eager: true })
  cafe: Cafe[];
}
