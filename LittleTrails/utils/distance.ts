type Coordinate = {
  latitude: number;
  longitude: number;
};

export function getRouteDistanceMeters(points: Coordinate[]) {
  const earthRadius = 6371000;
  const toRadians = (degrees: number) => degrees * Math.PI / 180;

  let total = 0;

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];

    const latitudeChange =
      toRadians(current.latitude - previous.latitude);

    const longitudeChange =
      toRadians(current.longitude - previous.longitude);

    const a =
      Math.sin(latitudeChange / 2) ** 2 +
      Math.cos(toRadians(previous.latitude)) *
      Math.cos(toRadians(current.latitude)) *
      Math.sin(longitudeChange / 2) ** 2;

    const clamped = Math.max(0, Math.min(1, a));

    const segment =
      2 * earthRadius * Math.atan2(
        Math.sqrt(clamped),
        Math.sqrt(1 - clamped)
      );

    total += segment;
  }

  return total;
}