export interface RouteStop {
  name: string;
  distanceFromOriginKm: number;
}

export interface BusRoute {
  id: string;
  origin: string[];
  destination: string[];
  stops: RouteStop[];
  distanceKm: number;
  estimatedDurationMin: number;
  fareGHS: number;
  destinationLat?: number;
  destinationLng?: number;
  active: boolean;
}
