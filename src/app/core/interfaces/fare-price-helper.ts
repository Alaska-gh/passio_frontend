import { Bus } from "./bus.interface";

export function getTransportFare(bus: Bus) {
  switch (bus.busType.toLowerCase()) {
    case 'normal':
      return 50
    case 'express':
      return 60
    case 'air-conditioned':
      return 56
    default:
      return 50
  }
}
