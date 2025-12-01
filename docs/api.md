# SmartVision API Documentation

Welcome to the SmartVision API, a powerful platform for turning real-time video feeds into structured, actionable intelligence. Our API is designed to be simple, robust, and easy to integrate into any application, from dashboards to complex event-driven systems.

## Getting Started

### Authentication

All API requests must be authenticated using an API key. You can generate and manage your keys from the **Admin** section of the SmartVision dashboard.

Include your API key in the `Authorization` header of your requests as a Bearer token.

**Example Header:**
```
Authorization: Bearer sk_live_your_api_key_here
```

---

## Core Endpoints

Our API is built around Genkit flows, which provide powerful, AI-driven analysis.

### 1. Analyze Parking Lot Occupancy

Analyzes a single video frame of a parking lot to determine occupancy status.

- **Endpoint:** `POST /api/flows/analyzeParking`
- **Description:** Accepts an image of a parking lot and returns a detailed analysis of its occupancy.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `totalSpots` | Number | Yes | The total number of parking spots available in the lot. |
| `videoFrame` | String | Yes | A single video frame encoded as a Base64 data URI. Format: `data:image/jpeg;base64,...` |

**Example Request:**
```json
{
  "totalSpots": 60,
  "videoFrame": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

#### Response Body

**On success (200 OK),** the API returns a JSON object with the analysis results.

**Example Response:**
```json
{
  "totalSpots": 60,
  "occupiedSpots": 15,
  "availableSpots": 45,
  "occupancyRate": 25,
  "status": "free",
  "message": "Parking has ample space."
}
```
* **`status` can be one of:** `free`, `moderate`, `busy`.

---

### 2. Generate Traffic Warning Message

Generates a concise warning message and suggested alternative route based on traffic conditions, suitable for digital signage.

- **Endpoint:** `POST /api/flows/generateTrafficWarningMessage`
- **Description:** Accepts traffic data and returns a formatted message for public display.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `trafficLevel`| String | Yes | The current estimated traffic level (e.g., 'heavy', 'moderate', 'light'). |
| `congestionDetails` | String | Yes | Specific details about the cause of congestion (e.g., "Accident reported on Main St bridge."). |

**Example Request:**
```json
{
  "trafficLevel": "heavy",
  "congestionDetails": "Accident reported on Main St bridge."
}
```

#### Response Body

**Example Response:**
```json
{
  "message": "ACCIDENT ON MAIN ST BRIDGE",
  "suggestedRoute": "Use Side St -> Oak Ave -> Return to Main"
}
```

---

### 3. Summarize Historical Video Analysis

Provides a natural language summary of historical analysis data over a given time period, highlighting trends and anomalies.

- **Endpoint:** `POST /api/flows/summarizeVideoAnalysis`
- **Description:** Accepts a set of historical analysis results and generates a summary.

#### Request Body

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `analysisType` | String | Yes | The type of analysis to summarize. Must be `traffic` or `train`. |
| `startTime` | Number | Yes | The Unix timestamp (milliseconds) for the start of the analysis period. |
| `endTime` | Number | Yes | The Unix timestamp (milliseconds) for the end of the analysis period. |
| `analysisResults` | String | Yes | A JSON string representing an array of analysis result objects from your database (e.g., Firestore). |

**Example Request:**
```json
{
  "analysisType": "traffic",
  "startTime": 1672531200000,
  "endTime": 1672617600000,
  "analysisResults": "[{\"timestamp\": 1672531260000, \"carCount\": 12}, {\"timestamp\": 1672531320000, \"carCount\": 15}]"
}
```

#### Response Body

**Example Response:**
```json
{
  "summary": "Between the specified times, traffic peaked around 5 PM, with an average of 15 cars per minute. An anomaly was detected at 6:15 PM, likely due to a minor obstruction that cleared quickly."
}
```

---

## Best Practices & Integration Notes

### Real-Time Analysis

- **Frame Frequency:** To manage costs and avoid overwhelming the API, we recommend throttling your analysis requests. For most parking and traffic scenarios, sending **1 frame every 2 to 5 seconds** provides a good balance of real-time accuracy and cost efficiency.
- **Client-Side vs. Edge:** For high-performance, real-time applications, consider a hybrid approach:
  1. Use a lightweight, local model on an edge device (like **YOLO**) for initial object detection (e.g., counting cars).
  2. Send the structured output from your edge model (or the full frame, if needed) to the SmartVision API endpoints for higher-level reasoning, summarization, or to trigger complex events.

### Data Contracts

The JSON objects returned by our API are designed to be stable and predictable. You can confidently build your application logic around these structures.
