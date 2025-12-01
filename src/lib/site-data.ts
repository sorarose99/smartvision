export type Site = {
  id: string;
  name: string;
  description: string;
  type: 'traffic' | 'parking';
  status: 'Operational' | 'Offline';
  quick: {
    status: 'heavy' | 'moderate' | 'free' | 'unknown' | 'busy';
    cars?: number;
    availableSpots?: number;
  };
  updatedAt: string;
  // Note: For Google Maps, x is longitude, y is latitude.
  position: { x: number, y: number };
};


export const initialSites: Site[] = [
  {
    id: 'intersection_1',
    name: 'King Fahd Rd & Olaya St',
    description: 'Major downtown intersection',
    type: 'traffic',
    status: 'Operational',
    quick: {
      status: 'heavy',
      cars: 25,
    },
    updatedAt: new Date().toISOString(),
    position: { x: 46.6753, y: 24.7136 }, // lng, lat for Riyadh Center
  },
  {
    id: 'lot_A1',
    name: 'STC Station Parking',
    description: 'Metro Line 1 parking',
    type: 'parking',
    status: 'Operational',
    quick: {
      status: 'free',
      availableSpots: 45,
    },
    updatedAt: new Date().toISOString(),
    position: { x: 46.685, y: 24.725 },
  },
  {
    id: 'intersection_2',
    name: 'Ring Rd & Khurais Rd',
    description: 'Eastern Ring Road exit',
    type: 'traffic',
    status: 'Operational',
    quick: {
      status: 'moderate',
      cars: 12,
    },
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    position: { x: 46.76, y: 24.72 },
  },
  {
    id: 'lot_B2',
    name: 'MOE Station Parking',
    description: 'Ministry of Education metro access',
    type: 'parking',
    status: 'Operational',
    quick: {
      status: 'busy',
      availableSpots: 5,
    },
    updatedAt: new Date().toISOString(),
    position: { x: 46.69, y: 24.70 },
  },
];
