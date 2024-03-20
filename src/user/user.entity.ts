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
  phoneNumber: string;

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

  @Column({ nullable: true, type: 'varchar', default: '' })
  instagramId: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  xId: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  facebookId: string;

  @OneToMany(() => Listing, (listing) => listing.user, { nullable: true })
  listings: Listing[];

  @OneToMany(() => Buyer, (buyer) => buyer.user, { nullable: true })
  buyers: Buyer[];

  @OneToMany(() => Campaign, (campaign) => campaign.user, { nullable: true })
  campaigns: Campaign[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
