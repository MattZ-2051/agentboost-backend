export const parseGmcResults = (
  caption: string,
): { firstCaption: string; otherCaptions: string[] } => {
  const re = /#\d{1}/g;

  const modifiedCaption = caption.replaceAll('*', '');
  const firstCaption = modifiedCaption.split(re)[1];
  const otherCaptions = modifiedCaption.split(re).slice(2, 5);
  return { firstCaption, otherCaptions };
};
