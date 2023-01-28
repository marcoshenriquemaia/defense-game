export const randomNumber = (min, max, safeArea) => {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  if (-random > -safeArea || random < safeArea) {
    return randomNumber(min, max, safeArea);
  }
  return random;
};
