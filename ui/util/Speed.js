export function getDisplayName(speed) {
  return speed[0].toUpperCase() + speed.substring(1);
}
export function isValidSpeed(speed) {
  if (speed === undefined || speed === NaN || speed === null) {
    return false;
  }
  return true;
}
