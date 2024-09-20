export const sliceWalletAddress = (str: string | undefined | null) => {
  if (!str) return null;

  const start = str.substring(0, 4);
  const end = str.substring(str.length - 4);
  return `${start}...${end}`;
};
