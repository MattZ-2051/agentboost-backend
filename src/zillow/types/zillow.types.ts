export type ZillowPropertyInfo = {
  zpid: number;
  imgSrc: string;
  zestimate: number;
  address: {
    city: string;
    state: string;
    neighberhood: string | null;
    streetAddress: string;
    zipcode: string;
  };
  county: string | null;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  resoFacts: {
    lotSize: string;
    livingArea: string;
  };
};
