export const getSortDisplayText = (sortValue) => {
  const sortMap = {
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    name: "Name: A to Z",
  };
  return sortMap[sortValue] || "";
};
