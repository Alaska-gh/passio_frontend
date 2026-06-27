export interface RouteStop {
  name: string;
  lat?: number;
  lng?: number;
  distanceFromOriginKm: number;
}
export interface BusRoute {
  id: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
  estimatedDurationMin: number;
  distanceKm: number,
  fareGHS: number;
  originLat: number;
  originLng: number;
  originRadiusKm: number;
  destinationLat: number;
  destinationLng: number;
  destinationRadiusKm: number;
  active: boolean
}
