# CarAPI.dev API Documentation - Full Implementation Guide

This document compiles the complete API documentation for CarAPI.dev, based on the public website at https://docs.carapi.dev/. It provides developers with all the information needed to fully implement and integrate the API, including authentication, rate limits, and detailed endpoint specifications. The API is a RESTful service with JSON responses, designed for automotive applications. It offers a free tier for developers to get started.

## Overview
CarAPI.dev is a comprehensive automotive data API platform for VIN decoding, license plate lookup, vehicle listings, and more. Build automotive applications with reliable, real-time data.

### Key Features
- **Lightning Fast**: Average response time under 200ms with global CDN distribution.
- **Secure & Reliable**: 99.9% uptime SLA with enterprise-grade security and encryption.
- **Real-time Data**: Always up-to-date information from trusted automotive databases.
- **Global Coverage**: Support for vehicles from 50+ countries with local regulations.

### Getting Started
1. Visit https://carapi.dev/ and sign up for an account.
2. Access your dashboard at https://carapi.dev/dashboard to generate an API key.
3. Use the API key as a `token` query parameter in all requests (e.g., `?token=YOUR_API_KEY`).
4. Base URL for all API calls: `https://api.carapi.dev/v1/`.
5. All endpoints use HTTP GET methods unless otherwise specified.
6. Responses are in JSON format.
7. Start with the free tier (100 requests/month) and upgrade as needed.

### Authentication
Authentication is token-based. Include your API key in the query string as `?token=YOUR_API_KEY`. Obtain your API key from the dashboard after signing up. Invalid or missing tokens result in a 403 Forbidden error.

### Rate Limits & Quotas
- **Request Quotas**:
  - Free Plan: 100 requests/month
  - Starter Plan: 5,000 requests/month
  - Professional Plan: 25,000 requests/month
  - Business Plan: 100,000 requests/month
- **Response Headers** for quota tracking:
  - `X-RateLimit-Remaining`: Remaining requests (e.g., 47)
  - `X-RateLimit-Reset`: Reset timestamp (e.g., 2025-10-14T16:27:07.177Z)
- **Quota Exceeded Response** (429 Too Many Requests):
  ```
  {
    "error": "API quota exceeded",
    "message": "You have reached your API request limit. Your quota will reset on 2025-10-14",
    "resetDate": "2025-10-14T16:27:07.177Z"
  }
  ```

### General Notes
- Most endpoints consume 1 credit per successful request (exceptions noted per endpoint).
- VIN parameters must be exactly 17 alphanumeric characters (excluding I, O, Q).
- Data is cached for performance; real-time updates from official sources.
- Error responses typically include an `error` field with details.
- SDKs and examples are available for popular languages.

## API Endpoints

### 1. VIN Decode
Decode any VIN to get comprehensive vehicle specifications including make, model, year, engine details, and more. Fast and reliable VIN decoder API.
- **Endpoint**: `GET /vin-decode/{vin}`
- **Credits**: 1 per request
- **Avg Response Time**: ~150ms

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number (URL path parameter) |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/vin-decode/1HGBH41JXMN109186?token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/vin-decode/1HGBH41JXMN109186?token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/vin-decode/1HGBH41JXMN109186"
params = {
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "vin": "1HGBH41JXMN109186",
  "specifications": {
    "make": "Honda",
    "model": "Civic",
    "fuel": "Gasoline",
    "transmission": "CVT",
    "enginePower": "110kW",
    "registrationDate": "2021-03-15"
  },
  "features": [
    "ABS",
    "ESP",
    "Airbags"
  ],
  "plateNumber": {
    "country": "SK",
    "plateNumber": "BL123AB"
  }
}
```

**Error (400)**
```
{
  "error": "Invalid VIN format"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| vin | string | The original VIN number provided |
| specifications | object | Vehicle specifications object |
| specifications.make | string | Vehicle manufacturer (e.g., Honda, Toyota) |
| specifications.model | string | Vehicle model name (e.g., Civic, Camry) |
| specifications.fuel | string | Primary fuel type (Gasoline, Diesel, Electric, Hybrid) |
| specifications.transmission | string | Transmission type (Manual, Automatic, CVT) |
| specifications.enginePower | string | Engine power in kW |
| specifications.registrationDate | string | Vehicle registration date (ISO format) |
| features | array | Array of vehicle features and equipment |
| plateNumber | object|null | Associated plate number information (if available) |
| plateNumber.country | string | Country code of the plate |
| plateNumber.plateNumber | string | License plate number |

#### Error Codes
- 400: Bad Request - Invalid VIN format or missing parameters
- 403: Forbidden - Invalid/missing token
- 404: Not Found - VIN not in database
- 500: Internal Server Error

#### Notes
- VIN must be exactly 17 characters.
- Data from official manufacturer databases.

### 2. Plate to VIN
Convert license plate numbers to VIN codes. Get vehicle identification numbers from license plates for various countries and regions.
- **Endpoint**: `GET /plate-to-vin/{plateNumber}`
- **Credits**: 1 per request
- **Avg Response Time**: ~200ms

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| plateNumber | string | Required | License plate number (URL path parameter) |
| country | string | Required | Country code (query parameter). Must be one of: PL, NO, SK, SE, CZ |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/plate-to-vin/ABC123?country=SK&token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/plate-to-vin/ABC123?country=SK&token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/plate-to-vin/ABC123"
params = {
    "country": "SK",
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "plateNumber": "ABC123",
  "country": "SK",
  "vin": "1HGBH41JXMN109186"
}
```

**Error (400)**
```
{
  "error": "Country parameter is required"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| plateNumber | string | The original plate number searched |
| country | string | Country code (e.g., SK, CZ, DE) |
| vin | string | null | Vehicle Identification Number (null if not found) |

#### Error Codes
- 400: Bad Request - Missing country or invalid format
- 403: Forbidden - Invalid/missing token
- 500: Internal Server Error

#### Notes
- Returns null if no VIN found.
- Supported countries limited; expansion planned.

### 3. Stolen Vehicle Check
Verify if a vehicle has been reported stolen using VIN or license plate. Real-time stolen vehicle database checks.
- **Endpoint**: `GET /stolen-check/{vin}`
- **Credits**: 2 per request
- **Avg Response Time**: ~300ms

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/stolen-check/1HGBH41JXMN109186?token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/stolen-check/1HGBH41JXMN109186?token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/stolen-check/1HGBH41JXMN109186"
params = {
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Clean (200)**
```
{
  "vin": "1HGBH41JXMN109186",
  "stolen": false,
  "countries": {
    "sk": false,
    "cz": false,
    "si": false,
    "hu": false,
    "ro": false
  }
}
```

**Stolen (200)**
```
{
  "vin": "WVWZZZ1JZ3D123456",
  "stolen": true,
  "countries": {
    "sk": true,
    "cz": false,
    "si": false,
    "hu": false,
    "ro": false
  }
}
```

**Error (400)**
```
{
  "error": "Invalid VIN format"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| vin | string | The VIN number that was checked |
| stolen | boolean | Overall stolen status (true if stolen in any country) |
| countries | object | Stolen status breakdown by country |
| countries.sk | boolean | Stolen status in Slovakia |
| countries.cz | boolean | Stolen status in Czech Republic |
| countries.si | boolean | Stolen status in Slovenia |
| countries.hu | boolean | Stolen status in Hungary |
| countries.ro | boolean | Stolen status in Romania |

#### Error Codes
- 400: Bad Request - Invalid VIN or missing parameters
- 403: Forbidden - Invalid/missing token
- 500: Internal Server Error

#### Notes
- Supported countries: SK, CZ, SI, HU, RO.
- Data from law enforcement databases.

### 4. Vehicle Valuation
Get vehicle valuation with original price and yearly market value estimations.
- **Endpoint**: `GET /vehicle-valuation/{vin}`
- **Credits**: 1 per request
- **Avg Response Time**: Not specified

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/vehicle-valuation/1HGBH41JXMN109186?token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/vehicle-valuation/1HGBH41JXMN109186?token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/vehicle-valuation/1HGBH41JXMN109186"
params = {
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "originalPrice": 39600,
  "currency": "EUR",
  "priceEstimation": [
    {
      "year": 2025,
      "price": 12672
    },
    {
      "year": 2026,
      "price": 11484
    },
    {
      "year": 2027,
      "price": 10296
    },
    {
      "year": 2028,
      "price": 9504
    },
    {
      "year": 2029,
      "price": 8712
    }
  ]
}
```

**Error (404)**
```
{
  "error": "Vehicle not found"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| originalPrice | number | Original purchase price of the vehicle |
| currency | string | Currency of all prices in the response |
| priceEstimation | array | Array of price estimations by year |
| priceEstimation[].year | number | Year of the price estimation |
| priceEstimation[].price | number | Estimated price for that year |

#### Error Codes
- 400: Bad Request - Invalid VIN or missing parameters
- 403: Forbidden - Invalid/missing token
- 404: Not Found - Vehicle not in database
- 500: Internal Server Error

#### Notes
- Future updates include maintenance, insurance, fuel costs.
- Depreciation based on market data.

### 5. Vehicle Photos
Get high-quality vehicle photos and images by VIN. Access exterior, interior, and detailed shots of vehicles.
- **Endpoint**: `GET /photos/{vin}`
- **Credits**: 1 per request
- **Avg Response Time**: ~200ms

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/photos/1HGBH41JXMN109186?token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/photos/1HGBH41JXMN109186?token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/photos/1HGBH41JXMN109186"
params = {
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success with Images (200)**
```
{
  "vin": "1HGBH41JXMN109186",
  "photos": [
    "https://images.carapi.dev/vehicles/1HGBH41JXMN109186/front.jpg",
    "https://images.carapi.dev/vehicles/1HGBH41JXMN109186/rear.jpg",
    "https://images.carapi.dev/vehicles/1HGBH41JXMN109186/side_left.jpg",
    "https://images.carapi.dev/vehicles/1HGBH41JXMN109186/side_right.jpg",
    "https://images.carapi.dev/vehicles/1HGBH41JXMN109186/interior.jpg"
  ]
}
```

**Success No Images (200)**
```
{
  "vin": "1HGBH41JXMN109186",
  "photos": []
}
```

**Error (400)**
```
{
  "error": "Invalid VIN format"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| vin | string | The VIN number that was queried |
| photos | string[] | Array of direct URLs to vehicle images |

#### Error Codes
- 400: Bad Request - Invalid VIN or missing parameters
- 403: Forbidden - Invalid/missing token
- 500: Internal Server Error

#### Notes
- Images ordered by creation date.
- Not all vehicles have photos.

### 6. Vehicle Listing
Search and filter vehicle listings with comprehensive market data. Find cars for sale with detailed specifications and pricing.
- **Endpoint**: `GET /listing`
- **Credits**: 1 per request
- **Avg Response Time**: Not specified

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| make | string | Optional | Filter by vehicle manufacturer (partial match) |
| model | string | Optional | Filter by vehicle model (partial match) |
| year | number | Optional | Filter by registration year (exact match) |
| limit | number | Optional | Number of results per page (default: 10, max: 50) |
| offset | number | Optional | Starting position for pagination (default: 0) |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/listing?make=Honda&limit=5&token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/listing?make=Honda&limit=5&token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/listing"
params = {
    "make": "Honda",
    "limit": "5",
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "listings": [
    {
      "vin": "19XFL1H76RE001117",
      "specifications": {
        "make": "Honda",
        "model": "Civic",
        "fuel": "petrol",
        "transmission": "automatic",
        "registrationDate": "2024-01-01T00:00:00.000Z"
      },
      "availability": {
        "imagesCount": 0,
        "plateNumbersCount": 1,
        "historyItemsCount": 1
      }
    }
  ],
  "pagination": {
    "limit": 5,
    "offset": 0
  }
}
```

**Error (500)**
```
{
  "error": "Internal server error"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| listings | array | Array of vehicle listing objects |
| listings[].vin | string | Vehicle Identification Number |
| listings[].specifications | object | Vehicle specifications |
| listings[].specifications.make | string | Vehicle manufacturer |
| listings[].specifications.model | string | Vehicle model |
| listings[].specifications.fuel | string|null | Fuel type (e.g., "petrol", "diesel", "electric") |
| listings[].specifications.transmission | string|null | Transmission type (e.g., "manual", "automatic") |
| listings[].specifications.registrationDate | string | Registration date (ISO format) |
| listings[].availability | object | Data availability counts |
| listings[].availability.imagesCount | number | Number of available images |
| listings[].availability.plateNumbersCount | number | Number of plate number records |
| listings[].availability.historyItemsCount | number | Number of history records |
| pagination | object | Pagination information |
| pagination.limit | number | Number of records per page |
| pagination.offset | number | Starting offset for current page |

#### Error Codes
- 403: Forbidden - Invalid/missing token
- 500: Internal Server Error

#### Notes
- Partial matching for make/model.
- Use pagination for large sets.

### 7. Vehicle Payments
Calculate loan payments and financing options for vehicles. Get payment schedules, interest rates, and financing details.
- **Endpoint**: `GET /payments/{vin}`
- **Credits**: 1 per request
- **Avg Response Time**: Not specified

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number |
| price | number | Required | Vehicle price (> 0) |
| downPayment | number | Required | Down payment amount (≥ 0) |
| loanTerm | number | Required | Loan term in months (> 0) |
| interestRate | number | Required | Annual interest rate as percentage (≥ 0) |
| currency | string | Optional | Target currency (default: EUR) |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/payments/JHMZE2H79AS019110?price=25000&downPayment=5000&loanTerm=60&interestRate=4.5&token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/payments/JHMZE2H79AS019110?price=25000&downPayment=5000&loanTerm=60&interestRate=4.5&token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/payments/JHMZE2H79AS019110"
params = {
    "price": "25000",
    "downPayment": "5000",
    "loanTerm": "60",
    "interestRate": "4.5",
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "vin": "JHMZE2H79AS019110",
  "payments": [
    {
      "amount": 5000,
      "currency": "EUR",
      "frequency": "one-time",
      "type": "down-payment",
      "description": "Initial down payment",
      "dueDate": "2025-09-12"
    },
    {
      "amount": 372,
      "currency": "EUR", 
      "frequency": "monthly",
      "type": "loan",
      "description": "Monthly loan payment 1/60",
      "dueDate": "2025-10-15"
    },
    {
      "amount": 372,
      "currency": "EUR",
      "frequency": "monthly", 
      "type": "loan",
      "description": "Monthly loan payment 2/60",
      "dueDate": "2025-11-15"
    }
    // ... additional payments
  ],
  "loanAmount": 20000,
  "totalPaid": 27320,
  "totalInterest": 2320,
  "monthlyPayment": 372,
  "currency": "EUR"
}
```

**Error (400)**
```
{
  "error": "Missing or invalid required parameter: price"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| vin | string | Vehicle Identification Number |
| payments | array | Array of payment objects with detailed payment schedule |
| payments[].amount | number | Payment amount |
| payments[].currency | string | Payment currency |
| payments[].frequency | string | Payment frequency (one-time, monthly, etc.) |
| payments[].type | string | Payment type (down-payment, loan) |
| payments[].description | string | Human-readable payment description |
| payments[].dueDate | string | Payment due date (YYYY-MM-DD format) |
| loanAmount | number | Total amount financed (price - down payment) |
| totalPaid | number | Total amount paid over the full loan period |
| totalInterest | number | Total interest paid over the loan period |
| monthlyPayment | number | Monthly payment amount |
| currency | string | Currency for all monetary values |

#### Error Codes
- 400: Bad Request
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

#### Notes
- Uses standard loan formula for calculations.
- Supported currencies: EUR, GBP, CZK, PLN, HUF, etc.

### 8. Vehicle Inspection
Get vehicle inspection records and technical examination data. Access MOT, TÜV, and other inspection information.
- **Endpoint**: `GET /inspection/{vin}`
- **Credits**: 1 per request
- **Avg Response Time**: ~400ms

#### Parameters
| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| vin | string | Required | 17-character Vehicle Identification Number |
| country | string | Required | Country code (currently only 'SK' supported) |
| token | string | Required | API authentication token (query parameter) |

#### Request Examples
**cURL**
```
curl -X GET \
  "https://api.carapi.dev/v1/inspection/1HGBH41JXMN109186?country=SK&token=YOUR_API_KEY"
```

**JavaScript**
```
// Using fetch API
const response = await fetch('https://api.carapi.dev/v1/inspection/1HGBH41JXMN109186?country=SK&token=YOUR_API_KEY', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

**Python**
```
import requests

url = "https://api.carapi.dev/v1/inspection/1HGBH41JXMN109186"
params = {
    "country": "SK",
    "token": "YOUR_API_KEY"
}

response = requests.get(url, params=params)
data = response.json()
print(data)
```

#### Response Examples
**Success (200)**
```
{
  "vin": "1HGBH41JXMN109186",
  "country": "SK",
  "inspection": {
    "stkValidTo": "2024-12-15",
    "ekValidTo": "2025-06-20"
  }
}
```

**Error (400)**
```
{
  "error": "Only Slovakia (SK) is currently supported"
}
```

#### Response Fields
| Field | Type | Description |
| --- | --- | --- |
| vin | string | The VIN number that was checked |
| country | string | Country code for the inspection system |
| inspection | object | Inspection data object |
| inspection.stkValidTo | string | STK (technical inspection) valid until date (ISO format) |
| inspection.ekValidTo | string | EK (emissions inspection) valid until date (ISO format) |

#### Error Codes
- 400: Bad Request - Invalid format, missing country, unsupported country
- 403: Forbidden - Invalid/missing token
- 404: Not Found - Data not found
- 500: Internal Server Error

#### Notes
- Currently only Slovakia (SK) supported.
- Future: CZ, DE, UK.

## Implementation Tips for Developers
- **Error Handling**: Always check HTTP status codes and parse the `error` field in responses.
- **Pagination**: Use `limit` and `offset` for endpoints like Vehicle Listing to manage large datasets.
- **Caching**: Leverage client-side caching for frequently accessed data, as responses are optimized.
- **SDKs**: Use provided examples to build in cURL, JS, Python; extend to other languages.
- **Testing**: Start with free tier; monitor quotas via headers.
- **Best Practices**: Validate inputs (e.g., VIN format) before API calls to avoid errors.
- **Support**: Contact via the main site for issues or feature requests.

This covers the full scope of CarAPI.dev for implementation. For updates, check the official docs.