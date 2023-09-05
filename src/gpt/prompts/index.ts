import { RealtyMoleData } from 'src/realty/types/realty.types';
import {
  GenerateListingGmcDto,
  GeneratePropertyInsightDto,
} from '../dto/gpt.dto';

export const generalListingProperyDescription = ({
  propertyAddress,
  realtyMoleData,
  extra,
}: {
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
  const prompt = `Act as a realtor writing a property description from home with the address ${propertyAddress} located in ${city} ${state}.
  Emphasize these features in the description: ${features} and the following extra information ${extra}. Keep the word character count under (1024)`;

  return prompt;
};

export const generateListingPropertyInsightPrompt = ({
  subdivision,
  avgDays,
  pricePerFoot,
  lotSize,
  avgLotSize,
  soldPrice,
  appreciationAvg,
}: GeneratePropertyInsightDto): string => {
  const prompt = `Act as a realtor and write a 3 paragraph analysis of this home based on the following information.
  The average days on market for a home in ${subdivision} in the last 6 months is ${avgDays}. The last home sold in ${subdivision} sold in ${subdivision} for ${pricePerFoot} or ${soldPrice}. Appreciation in ${subdivision} has been ${appreciationAvg}.
  The lot size of the subject home is ${lotSize} compared to the average lot size of ${avgLotSize}.
  State the advantages and disadvantages of this home compared to the averages of the subdivision and summarize the other data into a professional summary.
  This is not a property description, exclude all information that is not analysis.
  Do not include any call to action, this is strictly analysis.`;

  return prompt;
};

export const generateListingGmc = ({
  address,
  bed,
  bath,
  location,
  propertyDescription,
  squareFt,
}: GenerateListingGmcDto): { prompt1: string; prompt2: string } => {
  return {
    prompt1: `
  Act as a realtor writing a social media caption for a new listing located at ${address}.
  This house is a ${bed} ${bath} ${squareFt} and is described as ${propertyDescription}.
  Include 10 optimized hashtags for selling real estate in ${location}
  `,
    prompt2: `
    Act as a realtor writing a social media caption for a home located at ${address}.
    This house is a ${bed} ${bath} ${squareFt} and is described as ${propertyDescription}.
    Write 5 captions and each of these captions focus on a different unique feature of the home.
    For each post, include 10 optimized hashtags for selling real estate in ${location}.
  `,
  };
};
