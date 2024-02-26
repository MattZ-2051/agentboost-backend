import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: false, type: 'varchar' })
  messages: string;

  @Column({ nullable: false, type: 'bool' })
  active: boolean;

  @Column({ nullable: false, type: 'array', default: [] })
  targetAudience: string[];

  @ManyToOne(() => User, (user) => user.campaigns, { nullable: false })
  user: User;
}
