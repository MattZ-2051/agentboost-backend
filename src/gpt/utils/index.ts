import { Gmc } from '../../gmc/gmc.entity';

// const caption1 =
//   '#NampaIDHomes #NampaRealEstate #HomeForSale #DreamHome #MoveInReady #SpaciousLiving #ConvenientLocation #IdealFamilyHome #MustSeeProperty #ModernAmenities';
// const caption2 = `1. "Welcome to your spacious oasis in Nampa! 🏡✨ With 4 bedrooms and 2.5 baths, this home offers plenty of room for your family to grow. #NampaHomesForSale #FamilyLiving #SpaciousLiving"

// 2. "Step into timeless charm at 692 W Crimson Loop! ❤️🏠 This immaculate home built in 2003 has been lovingly maintained to offer the perfect blend of classic and modern. #TimelessCharm #ClassicHome #ModernAmenities"

// 3. "Make yourself at home in this light-filled sanctuary! ☀️🌿 The open floor plan and abundance of windows create a warm and inviting atmosphere throughout the day. #LightAndBright #OpenFloorPlan #NaturalLight"

// 4. "Say hello to the perfect garage for your vehicles and storage needs! 🚗💼 The spacious garage at 692 W Crimson Loop has room for two cars and extra space for all your belongings. #GarageGoals #AmpleStorage #CarLovers"

// 5. "Discover the best of both worlds – peace and convenience! 🌳🛍️ Located in a tranquil neighborhood, this home is just minutes away from schools, parks, shopping centers, and restaurants. #PeacefulLiving #ConvenientLocation #CloseToEverything`;

export const parseGmcResults = (
  res1: string,
  res2: string,
): { firstCaption: string; otherCaptions: string[] } => {
  const result: Gmc['caption'][] = [];

  let match;

  console.log('resses', res1, res2);
  const regex = /(\d+\.)\s+"([^"]+)"/g;
  while ((match = regex.exec(res2)) !== null) {
    // const number = match[1];
    const content = match[2];
    result.push(content);
  }

  return { firstCaption: res1, otherCaptions: result };
};
