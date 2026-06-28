import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, takeUntil } from 'rxjs';

export interface TrackingMember {
  member_id: string;
  lat: number;
  lng: number;
  has_arrived: boolean;
}

@Injectable({ providedIn: 'root' })
export class TrackingService implements OnDestroy {
  private ws: WebSocket | null = null;
  private destroy$ = new Subject<void>();
  private positionInterval$ = new Subject<void>();

  private members$ = new BehaviorSubject<TrackingMember[]>([]);
  private arrived$ = new BehaviorSubject<boolean>(false);
  private connected$ = new BehaviorSubject<boolean>(false);

  readonly members = this.members$.asObservable();
  readonly arrived = this.arrived$.asObservable();
  readonly connected = this.connected$.asObservable();

  //  Connect to session and start streaming position
  startTracking(
    sessionId: string,
    joinToken: string,
    driverName: string
  ): void {
    this.stopTracking();

    const wsUrl = `wss://nebula-rain.exe.xyz/v2/meet/${sessionId}/ws?t=${joinToken}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Tracking connected');
      
      this.connected$.next(true);
      // Send join message
      this.send({ type: 'join', display_name: driverName, reconnect_token: '' });

      // Stream position every 10 seconds
      interval(10000).pipe(
        takeUntil(this.positionInterval$)
      ).subscribe(() => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.send({
              type: 'position',
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy_m: pos.coords.accuracy,
            });
          },
          () => {} // silently ignore GPS errors during streaming
        );
      });
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'members':
          this.members$.next(message.members ?? []);
          break;
        case 'arrived':
          this.arrived$.next(true);
          break;
        case 'pong':
          break;
      }
    };

    this.ws.onclose = () => {
      this.connected$.next(false);
      this.positionInterval$.next();
    };

    this.ws.onerror = () => {
      this.connected$.next(false);
    };

    // Keep-alive ping every 30 seconds
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    });
  }

  stopTracking(): void {
    this.positionInterval$.next();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected$.next(false);
    this.members$.next([]);
    this.arrived$.next(false);
  }

  private send(message: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
    this.destroy$.next();
    this.destroy$.complete();
  }
}