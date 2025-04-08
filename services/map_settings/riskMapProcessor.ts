import { LatLng } from "react-native-maps";
import { ColorValue } from "react-native";

export interface Report {
    id: string;
    location: {
      latitude: number;
      longitude: number;
    };
    riskLevel: string;
    reportCount: number;
    intensity: number;
  }

export interface Cluster {
  location: LatLng;
  count: number;
  highestRisk: string;
  color: ColorValue;
  intensity: number;
}

const calculateDistance = (a: LatLng, b: LatLng): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const aVal =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

  return R * c;
};

const determineColor = (count: number, highestRisk: string): ColorValue => {
  if (highestRisk === "confirmed") return "rgba(255, 0, 0, 0.59)";
  if (count > 5 || highestRisk === "high") return "rgba(255, 157, 0, 0.53)";
  return "rgba(255, 225, 0, 0.6)";
};

export const processReports = (reports: Report[]): Cluster[] => {
  const clusters: Cluster[] = [];

  reports.forEach((report) => {
    let merged = false;

    for (const cluster of clusters) {
      if (calculateDistance(report.location, cluster.location) < 1) {
        cluster.count += 1;
        if (report.riskLevel === "confirmed") {
          cluster.highestRisk = "confirmed";
        } else if (
          report.riskLevel === "high" &&
          cluster.highestRisk !== "confirmed"
        ) {
          cluster.highestRisk = "high";
        }
        merged = true;
        break;
      }
    }

    if (!merged) {
      clusters.push({
        location: report.location,
        count: 1,
        highestRisk: report.riskLevel,
        color: "rgba(255, 225, 0, 0.6)",
        intensity: 1,
      });
    }
  });

  clusters.forEach((cluster) => {
    cluster.color = determineColor(cluster.count, cluster.highestRisk);
    cluster.intensity = cluster.highestRisk === "confirmed"
      ? 2.0
      : cluster.highestRisk === "rgba(255, 0, 0, 0.6)"
        ? 1.5
        : 1.0 + cluster.count / 10;
  });

  return clusters;
};