NHTSA VPIC API (Vehicle API) - Full Implementation Guide
https://vpic.nhtsa.dot.gov/api/ is the official public API provided by the U.S. National Highway Traffic Safety Administration (NHTSA) for the Vehicle Product Information Catalog and Vehicle Listing (vPIC). It offers free, no-authentication-required access to U.S. vehicle data submitted by manufacturers under federal regulations.
This is a completely public, free API (no API key needed), focused primarily on U.S. and Canadian vehicles. It's widely used for VIN decoding, manufacturer lookups, model listings, and more. Data is sourced from manufacturer reports (49 CFR Parts 551–595).
Key Features

No authentication required — truly open API.
Rate limiting: Automated throttling to prevent abuse (exact limits not published; fair use encouraged — avoid heavy scraping).
Formats: json (recommended), xml, csv (via ?format= query param; defaults vary by endpoint, often xml or json).
Base URL: https://vpic.nhtsa.dot.gov/api/
Version: Currently ~3.66 (as of late 2025).
Coverage: Strong for U.S. market vehicles (post-1981 VINs); partial for Canadian specs.
Batch support: Decode up to 50 VINs at once.
Wildcards: * supported in some VIN queries.
Best for: VIN decoding, make/model/year lookups, WMI info — no photos, pricing, plate lookups, stolen checks, or payments (unlike some commercial APIs).

All endpoints use HTTP GET (except batch decode, which supports POST in some wrappers but is GET in core).
General Notes

VINs must be 17 characters (standard since 1981); partial/wildcard allowed in some endpoints.
Responses include a Message, Count, SearchCriteria, and Results array/object.
Error handling: Check HTTP status (200 OK even for no results); look at Message field.
No quotas published, but heavy use may trigger throttling.
Language examples (C#, VB.NET, JS, PHP, Python) available on the site.
For local/offline use: Downloadable databases exist.

Main Endpoints
1. Decode VIN (Structured)
Endpoint: GET /vehicles/DecodeVin/{vin}
Description: Decodes a VIN into structured variables (key-value pairs).
Credits/Usage: Free.
Parameters:



ParameterRequiredDescriptionExamplevinYesVIN (supports * wildcard)1HGCM82633A004352formatNojson, xml (default xml)jsonmodelyearNoFilter to specific model year2010
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/1HGCM82633A004352?format=json
Typical Response (JSON snippet):
JSON{
  "Message": "Results returned successfully ...",
  "Count": 136,
  "Results": [
    { "Variable": "Make", "Value": "HONDA" },
    { "Variable": "Model", "Value": "Accord" },
    { "Variable": "Model Year", "Value": "2003" },
    // ... 100+ more variables (engine, safety, plant, etc.)
  ]
}
2. Decode VIN Values (Flat)
Endpoint: GET /vehicles/DecodeVinValues/{vin}
Description: Same as above but flat structure (easier parsing; one object per result).
Parameters: Same as DecodeVin.
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/1HGCM82633A004352?format=json
Response Snippet:
JSON{
  "Results": [
    {
      "Make": "HONDA",
      "Model": "Accord",
      "ModelYear": "2003",
      "VIN": "1HGCM82633A004352",
      // many more flat fields
    }
  ]
}
3. Decode VIN Extended
Endpoint: GET /vehicles/DecodeVinValuesExtended/{vin}
Description: Includes additional NHTSA-related variables (safety, crash, etc.).
Parameters: Same as above.
4. Decode WMI
Endpoint: GET /vehicles/DecodeWMI/{wmi}
Description: Decodes World Manufacturer Identifier (first 3 or 6 chars of VIN).
Parameters:


ParameterRequiredDescriptionwmiYese.g., "1HG", "JTD", "1T9131"
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/DecodeWMI/1HG?format=json
5. Get All Makes
Endpoint: GET /vehicles/GetAllMakes
Description: Lists every make in the database.
Best format: csv or json.
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json
6. Get Models for Make
Endpoint: GET /vehicles/GetModelsForMake/{make}
Description: All models for a make (partial name OK).
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/honda?format=json
By Make ID: /vehicles/GetModelsForMakeId/{makeId}
7. Get Models for Make + Year (+ Type)
Endpoint: GET /vehicles/GetModelsForMakeYear/make/{make}/modelyear/{year}
Flexible path segments (add /vehicletype/{type} as needed).
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/honda/modelyear/2020/vehicletype/car?format=json
By Make ID: Similar with GetModelsForMakeIdYear.
8. Get Makes for Manufacturer
Endpoint: GET /vehicles/GetMakeForManufacturer/{manufacturer}
Description: Makes produced by a manufacturer (name or ID).
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/honda?format=json
9. Get All Manufacturers
Endpoint: GET /vehicles/GetAllManufacturers
Parameters: ManufacturerType (optional), page (pagination).
10. Get WMIs for Manufacturer
Endpoint: GET /vehicles/GetWMIsForManufacturer/{manufacturer}
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/GetWMIsForManufacturer/honda?format=json
11. Decode VIN Batch
Endpoint: GET /vehicles/DecodeVINValuesBatch/ (or POST with form data)
Max: 50 VINs.
Parameter: data = comma-separated VINs (or semicolon in some examples); append ;year optionally.
Example:
texthttps://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/?data=1HGCM82633A004352,5UXWX7C5*BA&format=json
Other Notable Endpoints

/vehicles/GetVehicleTypesForMake/{make} — Car, truck, motorcycle, etc.
/vehicles/GetMakesForVehicleType/{type} — e.g., car, truck.
/vehicles/GetVehicleVariableList — All possible variable names.
/vehicles/GetVehicleVariableValuesList/{variable} — Values for a variable (e.g., "battery type").
/vehicles/GetEquipmentPlantCodes/{year} — Plant codes by year.
/vehicles/GetCanadianVehicleSpecifications — Canadian-specific data (limited).

Implementation Tips for Developers

Preferred format: Always add ?format=json for easy parsing.
cURL Example (Decode VIN):textcurl "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/1HGCM82633A004352?format=json"
JavaScript (Fetch):JavaScriptfetch('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/1HGCM82633A004352?format=json')
  .then(res => res.json())
  .then(data => console.log(data.Results[0]));
Python (requests):Pythonimport requests
url = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/1HGCM82633A004352?format=json"
response = requests.get(url)
data = response.json()
print(data['Results'][0]['Make'])
Caching: Highly recommended — data changes infrequently.
Error Handling: Parse Message and check if Count > 0.
Best Practices: Validate VIN format client-side; respect rate limits; use batch for multiple VINs.
Limitations: U.S.-centric; no real-time history, photos, pricing, international plates, or stolen status.

This covers the full public scope of the NHTSA VPIC API. Check https://vpic.nhtsa.dot.gov/api/ for any updates or release notes. Ideal for apps needing reliable, official U.S. vehicle specs! 🚗