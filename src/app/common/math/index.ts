export const toDeg = (n: number) => {
  return n * (180 / Math.PI);
};

export const toRad = (n: any) => {
  return n * (Math.PI / 180);
};
export const getBearing = (start: any, end: any) => {
  let startLat = toRad(start.latitude);
  let startLong = toRad(start.longitude);
  let endLat = toRad(end.latitude);
  let endLong = toRad(end.longitude);

  let dLong = endLong - startLong;

  let dPhi = Math.log(
    Math.tan(endLat / 2.0 + Math.PI / 4.0) /
      Math.tan(startLat / 2.0 + Math.PI / 4.0),
  );

  if (Math.abs(dLong) > Math.PI) {
    if (dLong > 0.0) dLong = -(2.0 * Math.PI - dLong);
    else dLong = 2.0 * Math.PI + dLong;
  }
  return (toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
};
export const computeOffsetCoordinate = (
  coordinate: any,
  distance: number,
  heading: number,
) => {
  distance = distance / (6371 * 1000);
  heading = toRad(heading);

  let lat1 = toRad(coordinate.latitude);
  let lon1 = toRad(coordinate.longitude);
  let lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance) +
      Math.cos(lat1) * Math.sin(distance) * Math.cos(heading),
  );
  let lon2 =
    lon1 +
    Math.atan2(
      Math.sin(heading) * Math.sin(distance) * Math.cos(lat1),
      Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2),
    );

  if (isNaN(lat2) || isNaN(lon2)) return null;

  return {
    latitude: toDeg(lat2),
    longitude: toDeg(lon2),
  };
};
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth radius in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
};
