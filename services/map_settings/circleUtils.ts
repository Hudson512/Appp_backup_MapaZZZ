export type Location = { latitude: number; longitude: number };

export interface Cluster {
  location: Location;
  intensity: number;
  count: number;
  highestRisk: string;
}

export const calculateDistance = (a: Location, b: Location): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Raio da Terra em km

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const aVal =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

  return R * c; // Distância em km
};

export const combineOverlappingCircles = (clusters: Cluster[]): Cluster[] => {
  const combinedClusters: Cluster[] = [];

  clusters.forEach((cluster) => {
    let merged = false;

    for (const combined of combinedClusters) {
      const distance = calculateDistance(cluster.location, combined.location);
      const combinedRadius = 500 + combined.intensity * 500;
      const clusterRadius = 500 + cluster.intensity * 500;

      // Verificar se os círculos realmente se interceptam
      if (distance <= combinedRadius + clusterRadius && distance > Math.abs(combinedRadius - clusterRadius)) {
        // Atualizar o círculo combinado
        combined.location = {
          latitude: (combined.location.latitude * combined.count + cluster.location.latitude * cluster.count) /
            (combined.count + cluster.count),
          longitude: (combined.location.longitude * combined.count + cluster.location.longitude * cluster.count) /
            (combined.count + cluster.count),
        };
        combined.intensity = Math.max(combined.intensity, cluster.intensity);
        combined.count += cluster.count;
        merged = true;
        break;
      }
    }

    if (!merged) {
      combinedClusters.push({ ...cluster });
    }
  });

  return combinedClusters;
};