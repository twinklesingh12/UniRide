import type { LatLng } from '../types';

/**
 * Socket.IO stand-in. `socket` mirrors the socket.io-client API
 * (connect / on / off / emit / disconnect) and `serverEmit` mirrors
 * `io.to(room).emit(...)` on the Node side. Rooms are `user:<id>` and
 * `ride:<id>`, exactly as the server implementation registers them.
 */

export type SocketEvent =
'notification' |
'chat:message' |
'ride:location' |
'ride:status' |
'booking:update' |
'sos:triggered' |
'auth:unauthorized';

type Listener = (payload: any) => void;

interface Target {
  user?: string;
  ride?: string;
  broadcast?: boolean;
}

interface SocketState {
  connected: boolean;
  userId: string | null;
  rooms: Set<string>;
  listeners: Map<SocketEvent, Set<Listener>>;
}

const state: SocketState = {
  connected: false,
  userId: null,
  rooms: new Set(),
  listeners: new Map()
};

export const socket = {
  get connected() {
    return state.connected;
  },
  get userId() {
    return state.userId;
  },
  connect(userId: string) {
    state.connected = true;
    state.userId = userId;
    state.rooms.add(`user:${userId}`);
  },
  disconnect() {
    state.connected = false;
    state.userId = null;
    state.rooms.clear();
    state.listeners.clear();
    stopAllBroadcasts();
  },
  join(room: string) {
    state.rooms.add(room);
  },
  leave(room: string) {
    state.rooms.delete(room);
  },
  on(event: SocketEvent, listener: Listener) {
    if (!state.listeners.has(event)) state.listeners.set(event, new Set());
    state.listeners.get(event)!.add(listener);
    return () => socket.off(event, listener);
  },
  off(event: SocketEvent, listener: Listener) {
    state.listeners.get(event)?.delete(listener);
  },
  emit(event: SocketEvent, payload: unknown) {
    // client -> server; the emulated server simply echoes into the same bus
    serverEmit({ broadcast: true }, event, payload);
  }
};

export function serverEmit(
target: Target,
event: SocketEvent,
payload: unknown)
: void {
  if (!state.connected) return;
  const allowed =
  target.broadcast === true || (
  target.user ? state.rooms.has(`user:${target.user}`) : false) || (
  target.ride ? state.rooms.has(`ride:${target.ride}`) : false);
  if (!allowed) return;
  state.listeners.get(event)?.forEach((listener) => {
    try {
      listener(payload);
    } catch {

      /* listener errors must not break the bus */}
  });
}

/* ---------------- live location broadcasting ---------------- */

const timers = new Map<string, number>();
const watchers = new Map<string, number>();

export interface LocationBroadcastOptions {
  rideId: string;
  fallbackRoute: LatLng[];
  onUpdate: (coords: LatLng) => void;
}

/**
 * Uses the HTML5 Geolocation API when the browser grants permission and falls
 * back to replaying the planned route so the demo still shows live movement.
 */
export function startLocationBroadcast({
  rideId,
  fallbackRoute,
  onUpdate
}: LocationBroadcastOptions): () => void {
  stopLocationBroadcast(rideId);
  let index = 8;

  const tick = () => {
    index = Math.min(fallbackRoute.length - 1, index + 1);
    onUpdate(fallbackRoute[index]);
  };

  const timer = window.setInterval(tick, 4000);
  timers.set(rideId, timer);

  if ('geolocation' in navigator) {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        onUpdate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {

        /* permission denied — simulated route keeps running */},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    watchers.set(rideId, watchId);
  }

  return () => stopLocationBroadcast(rideId);
}

export function stopLocationBroadcast(rideId: string): void {
  const timer = timers.get(rideId);
  if (timer) {
    window.clearInterval(timer);
    timers.delete(rideId);
  }
  const watchId = watchers.get(rideId);
  if (watchId !== undefined) {
    navigator.geolocation?.clearWatch(watchId);
    watchers.delete(rideId);
  }
}

function stopAllBroadcasts(): void {
  Array.from(timers.keys()).forEach(stopLocationBroadcast);
}

export function getCurrentPosition(): Promise<LatLng | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}