// Helper function checking if an entity moves right or left by radian angle
export function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}
