import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Buyer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, type: 'varchar' })
  address: string;

  @Column({ nullable: false, type: 'text' })
  propertyDescription: string;

  @Column({ nullable: false, type: 'text' })
  propertyInsight: string;

  @Column({ nullable: false, type: 'varchar' })
  city: string;

  @Column({ nullable: false, type: 'varchar' })
  state: string;

  @Column({ nullable: false, type: 'varchar' })
  zipCode: string;

  @ManyToOne(() => User, (user) => user.buyers, { nullable: false })
  user: User;
}
