import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Listing } from '../listing/listing.entity';
import { Buyer } from '../buyer/buyer.entity';
import { Campaign } from 'src/campaign/campaign.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: false, unique: false, type: 'varchar' })
  fullName: string;

  @Column({ nullable: true, unique: false, type: 'varchar', default: '' })
  profileImg: string;

  @Column({ nullable: true, unique: false, type: 'varchar', default: '' })
  businessLogo: string;

  @Column({ nullable: true, type: 'text', default: '' })
  brandDescription: string;

  @Column({ nullable: true, type: 'text', default: '' })
  brokerage: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  areaOfExpertise: string;

  @Exclude()
  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Exclude()
  @Column({ nullable: true, default: '', type: 'varchar' })
  rtHash: string;

  @Column({ nullable: true, type: 'bool', default: false })
  instagram: boolean;

  @Column({ nullable: true, type: 'bool', default: false })
  x: boolean;

  @Column({ nullable: true, type: 'bool', default: false })
  facebook: boolean;

  @OneToMany(() => Listing, (listing) => listing.user, { nullable: true })
  listings: Listing[];

  @OneToMany(() => Listing, (listing) => listing.user, { nullable: true })
  buyers: Buyer[];

  @OneToMany(() => Listing, (listing) => listing.user, { nullable: true })
  campaigns: Campaign[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
