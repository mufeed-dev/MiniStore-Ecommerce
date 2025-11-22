export const calculateProductRating = (productId) => {
  if (!productId) return { rating: "4.5", reviews: 100 };

  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = productId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const ratingValue = 3.5 + (Math.abs(hash) % 15) / 10;
  const reviewsCount = (Math.abs(hash) % 100) + 50;
  return { rating: ratingValue.toFixed(1), reviews: reviewsCount };
};
