# **App Name**: SmartVision

## Core Features:

- Real-time Video Analysis: Process live camera streams or uploaded videos using AI to identify traffic conditions and train status.
- Traffic Light Control: Dynamically adjust traffic light colors and durations based on real-time traffic analysis from AI. Displays changes and provides real-time updates using Firestore.
- Digital Signage: Display dynamic warning messages and alternative routes based on traffic conditions using AI. The tool is capable of dynamic changes.
- Train Status Monitoring: Detect and display train status (arriving, parked, leaving, departed) using real-time AI analysis of train platform video feeds.
- Camera Processor Screen: User interface to upload video or connect to a live camera stream and select analysis type (traffic or train).
- API Key Generation: Allow administrators to generate and manage API keys for secure access to the platform's AI analysis services.  Generated keys and related details such as user's email or username, time of access, number of times key was used for a specific duration would be saved in Firestore.  Rate limits per tier should be implemented with varying usage limits (e.g., 1000 calls/day).
- Admin Dashboard: Interface to manage registered screens and generate API keys.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to convey intelligence and authority.
- Background color: Light Gray (#D3D3D3) to provide a neutral, clean backdrop.
- Accent color: Vibrant Yellow (#FFD700) to highlight important information and CTAs.
- Body and headline font: 'Inter' for a modern, machined feel.
- Use modern, line-based icons to represent different functionalities and data points.
- Implement a clean and structured layout with clear visual hierarchy for easy navigation.
- Use subtle animations and transitions to provide visual feedback and enhance the user experience.