import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Listing {
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

  @Column({ nullable: false, type: 'varchar' })
  formattedAddress: string;

  @Column({ nullable: false, type: 'int' })
  bedrooms: number;

  @Column({ nullable: true, type: 'varchar', default: '' })
  county: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  legalDescription: string;

  @Column({ nullable: false, type: 'int' })
  squareFootage: number;

  @Column({ nullable: true, type: 'varchar', default: '' })
  subdivision: string;

  @Column({ nullable: false, type: 'int' })
  yearBuilt: number;

  @Column({ nullable: false, type: 'int' })
  bathrooms: number;

  @Column({ nullable: false, type: 'int' })
  lotSize: number;

  @Column({ nullable: false, type: 'varchar' })
  propertyType: string;

  @Column({ nullable: true, type: 'varchar', default: '' })
  lastSaleDate: string;

  @Column({ nullable: false, type: 'json' })
  features: JSON;

  @Column({ nullable: true, default: '{}', type: 'json' })
  propertyTaxes: JSON;

  @Column({ nullable: true, default: '{}', type: 'json' })
  owner: JSON;

  @ManyToOne(() => User, (user) => user.listings, { nullable: false })
  user: User;
}

// @Entity()
// export class Listing {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ nullable: false, unique: fakse, type: 'varchar' })
//   img: string;

//   @Column({ nullable: false, unique: fakse, type: 'varchar' })
//   img: string;
// }
