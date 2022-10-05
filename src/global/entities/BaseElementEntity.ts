import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseElementEntity {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @CreateDateColumn({ type: 'timestamp' })
  public readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public readonly updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  public readonly deletedAt?: Date | null;
}
