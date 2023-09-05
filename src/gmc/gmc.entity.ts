import { Listing } from '../listings/listings.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gmc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'text' })
  caption: string;

  @Column({ nullable: true, type: 'text' })
  img: string;

  @ManyToOne(() => Listing, (listing) => listing.gmcs)
  listing: Listing;
}
