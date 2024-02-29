import {
  GenerateListingGmcDto,
  GeneratePropertyInsightDto,
} from '../dto/gpt.dto';
import { ZillowPropertyInfo } from 'src/zillow/types/zillow.types';

/**
 *
 * @param {propertyAddress} - address of property that comes from user
 * @param {zillowInfo} - info coming from zillow rapid api
 * @param {extra} - extra info that comes from the user
 * @returns - prompt to be sent to chat gpt to generate property description for listing
 */
export const generateListingProperyDescriptionPrompt = ({
  propertyAddress,
  zillowInfo,
  brandDescription,
  keyInfo,
}: {
  propertyAddress: string;
  zillowInfo: ZillowPropertyInfo;
  brandDescription: string;
  keyInfo: string;
}): string => {
  const city = zillowInfo.address.city;
  const state = zillowInfo.address.state;
  const prompt = `Act as a realtor who is ${brandDescription} writing a property description from home with the address
                  ${propertyAddress} located in ${city},${state}. This home has these features: (bed, bath, count). Empghasize these features
                  in the description: ${keyInfo}. Keep the word character count under 1024. Make the result one continuous paragraph.`;

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
  const pricePerFoot = 23;
  let averageSquareFt = 0;
  let averageBedrooms = 0;
  const daysOld = 24;

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
