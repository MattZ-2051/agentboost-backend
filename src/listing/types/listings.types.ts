export type SaleListing = {
  county: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  price: number;
  listedDate: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  formattedAddress: string;
  lastSeen: string;
  createdDate: string;
  status: string;
  removedDate: string | null;
  daysOnMarket: number;
  id: string;
  latitude: number;
  longitude: number;
  zillowImages: string[];
};

export type Cma = {
  address: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  squareFt: string;
  price?: number;
  lotSize?: number;
  yearBuilt?: number;
};
