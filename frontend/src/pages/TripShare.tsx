import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheckIcon } from 'lucide-react';
import { RideMap } from '../components/map/RideMap';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Status';
import { ErrorState, LoadingState } from '../components/ui/States';
import { Logo } from '../components/layout/Logo';
import { useAsync } from '../hooks/useAsync';
import { api } from '../services/api';
import { formatLongDay, formatTime, fromNow, rideStageLabel } from '../utils/format';

export function TripShare() {
  const { token = '' } = useParams();
  const trip = useAsync(() => api.trips.share(token), [token]);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <Badge tone="neutral">Shared trip · read only</Badge>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        {trip.loading ?
        <LoadingState label="Loading shared trip…" /> :
        trip.error ?
        <ErrorState message={trip.error} /> :

        <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                {trip.data.ride.source} → {trip.data.ride.destination}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {formatLongDay(trip.data.ride.departure_date)} at{' '}
                {formatTime(trip.data.ride.departure_time)} ·{' '}
                {rideStageLabel[trip.data.ride.stage] ?? trip.data.ride.status}
              </p>
            </div>

            <Card padded={false} className="overflow-hidden">
              <RideMap
              source={trip.data.ride.source_coords}
              destination={trip.data.ride.dest_coords}
              route={trip.data.ride.route}
              driverLocation={trip.data.ride.driver_location}
              sourceLabel={trip.data.ride.source}
              destinationLabel={trip.data.ride.destination}
              className="h-[24rem] rounded-none border-0" />
            
              <p className="border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
                {trip.data.ride.location_updated_at ?
              `Driver location updated ${fromNow(trip.data.ride.location_updated_at)}` :
              'Live location is not being shared right now.'}
              </p>
            </Card>

            <Card>
              <CardHeader title="Driver and vehicle" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                  name={trip.data.ride.driver.full_name}
                  src={trip.data.ride.driver.avatar_url} />
                
                  <div>
                    <p className="font-semibold text-ink-900">
                      {trip.data.ride.driver.full_name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {trip.data.ride.vehicle ?
                    `${trip.data.ride.vehicle.make} ${trip.data.ride.vehicle.model} · ${trip.data.ride.vehicle.color} · ${trip.data.ride.vehicle.number}` :
                    'Vehicle pending'}
                    </p>
                  </div>
                </div>
                {trip.data.ride.driver.verified &&
              <Badge tone="success">
                    <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden />
                    Verified driver
                  </Badge>
              }
              </div>
              <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                This link shows the trip route, status and driver details only.
                Personal contact details of the passengers are never shared.
              </p>
            </Card>

            <div className="flex justify-center">
              <Link to="/">
                <Button variant="secondary">About UniRide</Button>
              </Link>
            </div>
          </div>
        }
      </main>
    </div>);

}