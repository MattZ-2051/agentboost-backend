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
  bedrooms,
  squareFt,
  radius,
  pool,
  lotSize,
}: GeneratePropertyInsightDto): string => {
  const subdivisionOrRadius = subdivision
    ? `in ${subdivision}`
    : `in a ${radius}km radius`;

  let averageDaysOnMarket = 0;
  let averageLotSize = 0;
  let pricePerFoot = 23;
  let averageSquareFt = 0;
  let averageBedrooms = 0;
  let daysOld = 24;

  for (const item of pool) {
    averageDaysOnMarket += item.daysOnMarket ? item.daysOnMarket : 0;
    averageLotSize += item.lotSize ? item.lotSize : 0;
    averageSquareFt += item.squareFootage ? item.squareFootage : 0;
    averageBedrooms += item.bedrooms ? item.bedrooms : 0;
  }
  averageLotSize = averageLotSize / pool.length;
  averageDaysOnMarket = averageDaysOnMarket / pool.length;
  averageSquareFt = averageSquareFt / pool.length;
  averageBedrooms = averageBedrooms / pool.length;

  const prompt = `Act as realtor (Agent profile key words) and write a 2 paragraph analysis of this home based on the following information.
  The average days on market for a home (${subdivisionOrRadius}) in the last 6 months is (${averageDaysOnMarket}).
  The most recent home sold in (${subdivisionOrRadius}) sold in (${daysOld}) days for $(${pricePerFoot}) per square foot - Do not analyze this, just state it.
  The lot size of the subject home is (${lotSize}) compared to the average lot size of (${averageLotSize})
  - State whether this is an advantage or disadvantage for the subject home compared to the other homes in the area or subdivision.
  The subject home has (${bedrooms}) bedrooms. The average for the area/subdivision is (${averageBedrooms})
  - State whether this is an advantage or disadvantage for the subject home compared to the other homes in the area or subdivision.
  This home has a sqft of (${squareFt}). The average sqft for the area/subdivision is (${averageSquareFt})
  - State whether this is an advantage or disadvantage for the subject home compared to the other homes in the area or subdivision.
  Summarize the data into a professional summary.
  This is not a property description, exclude all information that is not analysis.
  Do not include any call to action, this is strictly analysis.
  Include a paragraph with marketing strategies that could help this property sell faster based on its strengths,
  only include marketing tips that are directly related to its comparison to other homes in the area/subdivision.`;

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
