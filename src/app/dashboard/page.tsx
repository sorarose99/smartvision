'use client';

import React, { useState, useEffect } from 'react';
import StationSelector from '@/components/station-selector';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { InteractiveMap } from '@/components/interactive-map';
import { initialSites } from '@/lib/site-data';


function ClientOnlyTime({ updatedAt }: { updatedAt: string }) {
    const [displayTime, setDisplayTime] = useState('');
  
    useEffect(() => {
      // This code runs only on the client, after hydration
      const date = new Date(updatedAt);
      if(!isNaN(date.getTime())) {
        setDisplayTime(date.toLocaleTimeString());
      }
    }, [updatedAt]);
  
    // Render a placeholder or nothing on the server and initial client render
    if (!displayTime) {
      return null;
    }
  
    return <>{displayTime}</>;
}

export default function DashboardPage() {
  const [sites] = useState(initialSites);
  const [selected, setSelected] = useState<typeof initialSites[0] | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SmartVision Dashboard</h1>
        <p className="text-muted-foreground">
          Live AI-powered traffic simulation and site monitoring. Hover over intersections for AI insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StationSelector
            items={sites.map((s) => ({
              id: s.id,
              title: s.name,
              subtitle: s.description,
              type: s.type,
            }))}
            selected={selected}
            onSelect={(item) => {
                const site = sites.find(s => s.id === item.id);
                setSelected(site || null);
            }}
          />
          <div className="flex flex-col gap-2">
            {selected && (
              <>
                <Link
                  href={`/dashboard/${selected.type === 'traffic' ? 'traffic-signal' : 'parking-status'}`}
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  View Live Monitor
                </Link>
                <Link
                  href="/dashboard/camera"
                  className={cn(buttonVariants({ variant: 'secondary' }))}
                >
                  Open Analysis Input
                </Link>
              </>
            )}
             <Button asChild variant="outline">
                <Link href="/dashboard/camera">Try the Demo</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-lg p-4 bg-card border">
          <h2 className="text-xl font-semibold mb-2">Live Site Map</h2>
          <InteractiveMap sites={sites} />
        </div>
      </div>
    </div>
  );
}
