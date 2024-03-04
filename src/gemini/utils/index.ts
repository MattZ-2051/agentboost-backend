export const parseGmcResults = (
  caption: string,
): { firstCaption: string; otherCaptions: string[] } => {
  const re = /#\d{1}/g;
  const firstCaption = caption.split(re)[1];
  const otherCaptions = caption.split(re).slice(2, 5);
  return { firstCaption, otherCaptions };
};
