import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { environment } from '@env/environment';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MeetSession {
  session_id: string;
  join_token: string;
  expires_at: string;
}

export interface GeofenceCheckResult {
  inside: boolean;
  distance_km: number;
}

export interface RouteResult {
  distance_m: number;
  duration_s: number;
  eta_s: number;
}

@Injectable({ providedIn: 'root' })
export class GhanaPostGpsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://nebula-rain.exe.xyz';

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'X-API-Key': `${environment.ghanaPostGPS.ghanaPostApiKey}`,
      'Content-Type': 'application/json',
    });
  }

  //  Get current device coordinates via browser GPS
  getCurrentPosition(): Observable<Coordinates> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error(new Error('Geolocation not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition((position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          observer.complete();
        },
        (error) => {
          const messages: Record<number, string> = {
            1: 'Location access denied. Please allow location access.',
            2: 'Location unavailable. Please try again.',
            3: 'Location request timed out. Please try again.',
          };
          observer.error(new Error(messages[error.code] ?? 'Could not get your location.'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  //  Open a live tracking session when bus departs
  createMeetSession(destination: Coordinates, label: string): Observable<MeetSession> {
    return this.http.post<MeetSession>(`${this.baseUrl}/v2/meet`, {
        dest_lat: destination.lat,
        dest_lng: destination.lng,
        dest_label: label,
      },
      { headers: this.headers }
    ).pipe(
      catchError(err => throwError(() =>
        new Error(`Failed to create tracking session: ${err.message}`)
      ))
    );
  }

  //  Check if coordinates are within a geofence
  checkGeofence(coords: Coordinates, geofenceName: string): Observable<GeofenceCheckResult> {
    return this.http.get<any>(`${this.baseUrl}/v2/geofence/check`, {
        headers: this.headers,
        params: {
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
          customer_id: geofenceName,
        }
      }
    ).pipe(
      map(response => ({
        inside: response.inside,
        distance_km: response.breached?.[0]?.distance_km
          ?? this.haversineKm(coords, { lat: 0, lng: 0 }),
      })),
      catchError(err => throwError(() =>
        new Error(`Geofence check failed: ${err.message}`)
      ))
    );
  }

  // Create a geofence for a station
  createGeofence(
    name: string,
    center: Coordinates,
    radiusKm: number
  ): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/v2/geofence/create`,
      {
        name,
        center_lat: center.lat,
        center_lng: center.lng,
        radius_km: radiusKm,
        alert_on: 'enter',
        customer_id: name,
      },
      { headers: this.headers }
    );
  }

  //  Get route distance and ETA between two points
  getRoute(from: Coordinates, to: Coordinates): Observable<RouteResult> {
    return this.http.post<any>(
      `${this.baseUrl}/v2/route`,
      {
        from: { point: { lat: from.lat, lng: from.lng } },
        to: { point: { lat: to.lat, lng: to.lng } },
        mode: 'driving',
      },
      { headers: this.headers }
    ).pipe(
      map(response => ({
        distance_m: response.data.distance_m,
        duration_s: response.data.duration_s,
        eta_s: response.data.eta_s,
      }))
    );
  }

  // Reverse geocode — get human readable location
  reverseGeocode(coords: Coordinates): Observable<string> {
    return this.http.get<any>(
      `${this.baseUrl}/v2/reverse`,
      {
        headers: this.headers,
        params: {
          lat: coords.lat.toString(),
          lng: coords.lng.toString(),
        }
      }
    ).pipe(
      map(response => response.data.area ?? response.data.address ?? 'Unknown location')
    );
  }

  // Local haversine for fallback distance calculation
  haversineKm(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371;
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLng = this.toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) *
      Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}