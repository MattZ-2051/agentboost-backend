// import { Gmc } from '../../gmc/gmc.entity';

import { Gmc } from '../../gmc/gmc.entity';

// const testCaptions = `1. "Step inside this charming Single Family Home nestled in the heart of Boise, ID. With 2 bedrooms and 2 bathrooms, this cozy dwelling offers the perfect size for comfortable living. #BoiseHomesForSale #CharmingHome #CozyLiving #IDRealEstate #SmallButMighty"

// 2. "Experience the timeless appeal of 10044 W Springdale Ct. This well-maintained home boasts a unique character and a thoughtful floor plan that allows for seamless flow between spaces. #BoiseRealEstate #TimelessCharm #WelcomingHome #BoiseID #HomeSweetHome"

// 3. "Built in 1976, this home carries a sense of history and quality craftsmanship. The interior exudes warmth, providing an inviting atmosphere for your everyday enjoyment. #VintageHome #Craftsmanship #WarmAndInviting #TimelessBeauty #HomeSweetHome"

// 4. "Situated on a well-manicured lot, this home offers a spacious two-car garage and a delightful atrium. Enjoy the beauty of nature indoors and unwind in your own serene oasis. #BoiseLiving #OutdoorLiving #SereneOasis #RelaxationTime #NatureLovers"

// 5. "Explore the vibrant city of Boise, ID, just moments from your doorstep. From picturesque parks to diverse dining options, there's always something to discover. Don't miss out on this incredible real estate opportunity! #BoiseLife #CityLiving #OutdoorAdventures #DreamHome #BoiseIDRealEstate""
// `;

export const parseGmcResults = (
  res1: string,
  res2: string,
): { firstCaption: string; otherCaptions: string[] } => {
  const result: Gmc['caption'][] = [];

  for (let i = 1; i < 6; i++) {
    if (i < 5) {
      const caption = res2
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .substring(res2.indexOf(`${i}.`), res2.indexOf(`${i + 1}.`));
      result.push(caption);
    } else {
      const caption = res2
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .substring(res2.indexOf(`${i}.`), res2.length - 1);
      result.push(caption);
    }
  }
  return { firstCaption: res1, otherCaptions: result };
};
