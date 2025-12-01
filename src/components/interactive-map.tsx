'use client';

import React from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { Site } from '@/lib/site-data';
import { TrafficCone, Car, Building, Info, MessageSquare } from 'lucide-react';
import { useTrafficSimulation } from '@/hooks/use-traffic-simulation';
import { cn } from '@/lib/utils';
import { LightState } from '@/ai/flows/manage-traffic-flow';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

const TrafficLightIcon = ({ state }: { state: LightState }) => {
  const colorClass = {
    green: 'text-green-500 animate-pulse',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
  }[state];
  return <TrafficCone className={cn('h-5 w-5 transition-colors', colorClass)} />;
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapCenter = {
  lat: 24.7136, // Riyadh latitude
  lng: 46.72, // Riyadh longitude
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
    ]
};

const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height / 2),
});


export function InteractiveMap({ sites }: { sites: Site[] }) {
    const { intersectionStates, simulationStatus, lastUpdated, digitalSignMessage } = useTrafficSimulation(sites);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    });

    const trafficSites = sites.filter(s => s.type === 'traffic');
    const parkingSites = sites.filter(s => s.type === 'parking');

    if (loadError) return <p>Error loading maps</p>;
    if (!isLoaded || !intersectionStates) return <Skeleton className="h-[500px] w-full" />;

    return (
        <div className="relative h-[500px] w-full rounded-lg overflow-hidden border">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={13}
                options={mapOptions}
            >
                {/* Render Traffic Intersections */}
                {trafficSites.map((site) => {
                    const state = intersectionStates[site.id];
                    if (!state || !site.position) return null;
                    
                    const position = {
                        lat: site.position.y,
                        lng: site.position.x
                    };

                    return (
                        <OverlayView
                            key={site.id}
                            position={position}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            getPixelPositionOffset={getPixelPositionOffset}
                        >
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="cursor-pointer" style={{ transform: 'translate(-50%, -50%)' }}>
                                        <div className="relative w-28 h-28 flex items-center justify-center">
                                            {/* Centerpiece */}
                                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center border-2 border-blue-400">
                                                <Info className="h-5 w-5 text-blue-300" />
                                            </div>
                                            
                                            {/* Lights */}
                                            <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2"><TrafficLightIcon state={state.lights['West']} /></div>
                                            <div className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2"><TrafficLightIcon state={state.lights['East']} /></div>
                                            <div className="absolute left-1/2 top-0 -translate-y-full -translate-x-1/2"><TrafficLightIcon state={state.lights['North']} /></div>
                                            <div className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2"><TrafficLightIcon state={state.lights['South']} /></div>

                                            {/* Label */}
                                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max text-center">
                                                <p className="text-xs font-medium bg-background/80 px-2 py-1 rounded-md border text-foreground">{site.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">تحليل الذكاء الاصطناعي: {site.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                سجل القرارات الفوري لهذا التقاطع.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold">القرار الحالي:</p>
                                            <p className="text-sm p-2 bg-muted rounded-md text-right">"{state.reasoning || 'جاري التهيئة...'}"</p>
                                            <div className="flex justify-between items-center">
                                                <Badge variant={state.trafficLevel === 'heavy' ? 'destructive' : state.trafficLevel === 'moderate' ? 'secondary' : 'default'}>
                                                    حالة المرور: {state.trafficLevel}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">الضوء الأخضر: {state.duration}s</span>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </OverlayView>
                    );
                })}

                {/* Render Parking Lots */}
                {parkingSites.map((site) => {
                    if (!site.position) return null;
                    const position = {
                        lat: site.position.y,
                        lng: site.position.x
                    };
                    return (
                        <OverlayView 
                            key={site.id} 
                            position={position}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            getPixelPositionOffset={getPixelPositionOffset}
                        >
                             <div className="z-10" style={{transform: 'translate(-50%, -50%)' }}>
                                <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-background/90 border-2 border-dashed border-blue-400">
                                <div className="flex gap-2 items-center text-blue-400">
                                    <Car className="h-5 w-5" />
                                    <Building className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-bold w-max text-foreground">{site.name}</p>
                                </div>
                            </div>
                        </OverlayView>
                    )
                })}

                {/* Digital Sign */}
                 {digitalSignMessage && (
                     <OverlayView
                        position={{ lat: 24.72, lng: 46.6753 }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={() => ({ x: -144, y: -40 })} // width is w-72 (288px)
                     >
                        <div className="z-10">
                            <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-yellow-400/90 text-black border-2 border-black w-72 shadow-lg">
                            <div className="flex gap-2 items-center font-bold">
                                <MessageSquare className="h-5 w-5" />
                                DIGITAL SIGNAGE
                            </div>
                            <p className="text-sm font-semibold text-center">{digitalSignMessage}</p>
                            </div>
                        </div>
                     </OverlayView>
                )}
            </GoogleMap>
             <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                <p>Status: <span className={cn("font-bold", simulationStatus === 'running' ? 'text-green-400' : 'text-yellow-400')}>{simulationStatus}</span></p>
                {lastUpdated && <p>Last AI decision: {lastUpdated}</p>}
            </div>
        </div>
    );
}
