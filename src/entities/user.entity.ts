import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ default: 'activist' }) // 'admin', 'coordinator', 'activist'
  role: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  district: string;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ default: 'Новичок' })
  status: string;

  @Column({ default: 0 })
  balance: number;
}