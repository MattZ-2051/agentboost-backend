import { Gmc } from '../gmc/gmc.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'int' })
  zpid: number;

  @Column({ nullable: false, type: 'int' })
  price: number;

  @Column({ nullable: true, type: 'float' })
  pricePerFoot: number;

  @Column({ nullable: true, type: 'varchar' })
  associationFees: string;

  @Column({ nullable: false, type: 'varchar' })
  imgSrc: string;

  @Column({ nullable: false, type: 'varchar' })
  propertyType: string;

  @Column({ nullable: false, type: 'varchar' })
  squareFt: string;

  @Column({ nullable: false, type: 'varchar' })
  city: string;

  @Column({ nullable: false, type: 'varchar' })
  state: string;

  @Column({ nullable: false, type: 'varchar' })
  zipCode: string;

  @Column({ nullable: false, type: 'varchar' })
  streetAddress: string;

  @Column({ nullable: false, type: 'text' })
  zillowDescription: string;

  @Column({ nullable: false, type: 'text' })
  propertyDescription: string;

  @Column({ nullable: false, type: 'jsonb' })
  nearbyPoi: JSON;

  @Column({ nullable: false, type: 'int' })
  propertyInsightAvgFt: number;

  @Column({ nullable: false, type: 'int' })
  propertyInsightAvgPrice: number;

  @Column({ nullable: false, type: 'text' })
  lotSize: string;

  @Column({ nullable: false, type: 'int' })
  bedrooms: number;

  @Column({ nullable: false, type: 'float' })
  bathrooms: number;

  @Column({ nullable: false, type: 'int' })
  yearBuilt: number;

  @Column({ nullable: true, type: 'float', default: null })
  garageCount: number;

  @Column({ nullable: true, type: 'varchar', default: null })
  county: string;

  @Column({ nullable: true, type: 'varchar', default: null })
  subdivision: string;

  @Column({ nullable: true, default: null, type: 'jsonb' })
  cma: JSON;

  @ManyToOne(() => User, (user) => user.listings, { nullable: false })
  user: User;

  @OneToMany(() => Gmc, (gmc) => gmc.listing, { nullable: true })
  gmcs: Gmc[];
}
