import { Listing } from '../listings/listings.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gmc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'text' })
  caption1: string;

  @Column({ nullable: false, type: 'text' })
  caption2: string;

  @Column({ nullable: false, type: 'text' })
  caption3: string;

  @Column({ nullable: false, type: 'text' })
  caption4: string;

  @Column({ nullable: false, type: 'text' })
  caption5: string;

  @ManyToOne(() => Listing, (listing) => listing.gmc, { nullable: false })
  listing: Listing;
}
