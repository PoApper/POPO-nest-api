import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['user_id', 'notice_id'], { unique: true })
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  notice_id: string;

  @CreateDateColumn()
  createdAt: Date;
}
