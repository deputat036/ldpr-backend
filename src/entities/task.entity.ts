import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  reward: number;

  @Column({ nullable: true })
  region: string; // Если null - задача для всей страны

  @Column({ nullable: true })
  district: string; // Если null - задача для всего региона
}