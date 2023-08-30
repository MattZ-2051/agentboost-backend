import { RealtyMoleData } from 'src/realty/types/realty.types';

export const generalListingProperyDescription = ({
  agentProfile,
  propertyAddress,
  realtyMoleData,
  extra,
}: {
  agentProfile: string;
  propertyAddress: string;
  realtyMoleData: RealtyMoleData;
  extra: string;
}): string => {
  const data = realtyMoleData?.[0];
  const city = data.city;
  const state = data.state;
  const baths = data.bathrooms;
  const beds = data.bedrooms;
  const floorCount = data.features.garage;
  const garage = data.features.garage;
  const garageSpaces = data.features.garageSpaces;
  const yearBuilt = data.yearBuilt;
  const squareFootage = data.squareFootage;
  const propertyType = data.propertyType;

  let features = `bathrooms - ${baths}, bedrooms - ${beds}, floors - ${floorCount}, year built - ${yearBuilt}, square footage ${squareFootage}, property type - ${propertyType}`;
  if (garage) {
    features += `has a garage with ${garageSpaces} spaces`;
  }
  const prompt = `Act as realtor ${agentProfile} writing a property description from home with the address ${propertyAddress} located in ${city} ${state}.
  Emphasize these features in the description: ${features} and the following extra information ${extra}. Keep the word character count under (1024)`;

  return prompt;
};
