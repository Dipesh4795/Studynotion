export default function GetAvgRating(ratingArr) {
  if (ratingArr?.length === 0) return 0;
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.rating;
    return acc;
  }, 0);
  console.log("totalratingcateory page mein", totalReviewCount);
  const multiplier = Math.pow(10, 1);
  const avgReviewCount =
    Math.round(
      (parseFloat(totalReviewCount) / ratingArr?.length) * multiplier
    ) / multiplier;

  return avgReviewCount;
}
