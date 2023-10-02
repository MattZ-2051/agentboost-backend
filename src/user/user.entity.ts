import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Listing } from '../listing/listing.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'text', default: '' })
  brandDescription: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  areaOfExpertise: string;

  @Exclude()
  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Exclude()
  @Column({ nullable: true, default: '', type: 'varchar' })
  rtHash: string;

  @OneToMany(() => Listing, (listing) => listing.user, { nullable: true })
  listings: Listing[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
