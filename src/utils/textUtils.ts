export const capitalizeFirstLetter = (
  str: string | null | undefined
): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (text: string, max = 50) =>
  text.length > max ? `${text.slice(0, max)}...` : text;
