# Vehicle Data Website - Architecture Plan

## Project Overview
A free, public, SEO-optimized vehicle data website using Next.js and CarAPI.dev. The site will be authoritative, neutral, minimal, and fast — functioning as a public reference tool.

## Core Principles
- **No auth, no accounts, no paywalls** - completely open access
- **SEO-first** - semantic HTML, structured data, crawlable URLs
- **Performance** - server-side rendering, static generation, no client-side bloat
- **Minimalism** - no rounded corners, no animations, no gradients, flat design
- **Accessibility** - keyboard navigable, high contrast, semantic markup

---

## 1. Folder Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout with global styles
│   ├── globals.css               # Global CSS variables & reset
│   ├── cars/
│   │   ├── page.tsx              # Browse vehicles (filter page)
│   │   ├── [year]/
│   │   │   └── page.tsx          # Vehicles by year
│   │   ├── [year]/[make]/
│   │   │   └── page.tsx          # Vehicles by year/make
│   │   └── [year]/[make]/[model]/
│   │       └── page.tsx          # Vehicles by year/make/model
│   ├── vehicle/
│   │   └── [id]/
│   │       └── page.tsx          # Vehicle detail page
│   ├── vin/
│   │   └── page.tsx              # VIN decoder page
│   ├── compare/
│   │   └── page.tsx              # Vehicle comparison page
│   ├── about/
│   │   └── page.tsx              # About / API coverage page
│   ├── sitemap.ts                # Dynamic sitemap generation
│   └── robots.ts                 # Robots.txt generation
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.css
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── Input.module.css
│   │   ├── Select/
│   │   │   ├── Select.tsx
│   │   │   └── Select.module.css
│   │   ├── Table/
│   │   │   ├── Table.tsx
│   │   │   └── Table.module.css
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Container/
│   ├── search/                   # Search-related components
│   │   ├── VehicleSearch/
│   │   ├── VinSearch/
│   │   └── FilterBar/
│   ├── vehicle/                  # Vehicle display components
│   │   ├── VehicleTable/
│   │   ├── VehicleCard/
│   │   ├── VehicleSpecs/
│   │   └── VehicleComparison/
│   └── seo/                      # SEO components
│       ├── JsonLd/
│       ├── MetaTags/
│       └── OpenGraph/
├── lib/                          # Utilities & configurations
│   ├── api/                      # API layer
│   │   ├── carapi.ts             # CarAPI.dev client
│   │   ├── endpoints.ts          # API endpoint definitions
│   │   ├── types.ts              # API response types
│   │   └── cache.ts              # Caching utilities
│   ├── seo/                      # SEO utilities
│   │   ├── structured-data.ts    # JSON-LD generators
│   │   ├── meta.ts               # Meta tag generators
│   │   └── urls.ts               # URL utilities
│   ├── utils/
│   │   ├── format.ts             # Formatting utilities
│   │   ├── validation.ts         # Input validation
│   │   └── constants.ts          # App constants
│   └── config.ts                 # App configuration
├── styles/                       # Additional styles
│   ├── variables.css             # CSS custom properties
│   ├── typography.css            # Typography styles
│   └── utilities.css             # Utility classes
├── public/                       # Static assets
│   └── favicon.ico
├── types/                        # Global TypeScript types
│   └── index.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 2. Component Hierarchy

### Page Components
Each page is a server component by default, fetching data server-side.

```
Layout (Root)
├── Header
│   ├── Logo
│   └── Nav
├── Main Content (Page-specific)
└── Footer
    ├── Links
    └── Copyright
```

### Vehicle Detail Page
```
VehicleDetailPage
├── JsonLd (Vehicle structured data)
├── VehicleHeader
│   ├── Title (Year Make Model Trim)
│   └── MSRP (if available)
├── VehicleSpecs
│   ├── SpecSection (Overview)
│   ├── SpecSection (Engine & Performance)
│   ├── SpecSection (Dimensions)
│   ├── SpecSection (Fuel Economy)
│   └── SpecSection (Drivetrain)
└── RelatedVehicles (optional)
```

### Browse Page
```
BrowsePage
├── PageHeader
├── FilterBar
│   ├── YearSelect
│   ├── MakeSelect
│   ├── ModelSelect
│   └── TrimSelect
├── VehicleTable
│   ├── TableHeader
│   └── TableRow (vehicle summaries)
└── Pagination
```

### VIN Decoder Page
```
VinDecoderPage
├── PageHeader
├── VinInput
├── DecodeButton
└── VinResults
    ├── VehicleSummary
    └── SpecTable
```

### Compare Page
```
ComparePage
├── PageHeader
├── VehicleSelector (up to 3)
└── ComparisonTable
    ├── SpecRow (repeated for each spec)
    └── ValueCell (per vehicle)
```

---

## 3. Design System

### CSS Variables
```css
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-border: #e0e0e0;
  --color-border-dark: #1a1a1a;
  --color-accent: #2563eb; /* Blue accent */
  --color-accent-hover: #1d4ed8;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  
  /* Layout */
  --max-width: 1200px;
  --content-width: 900px;
  
  /* Border */
  --border-width: 1px;
  --border-radius: 0; /* No rounded corners */
}
```

### Typography Scale
- **H1**: 2.5rem / bold / tight line-height (page titles)
- **H2**: 2rem / bold / tight line-height (section titles)
- **H3**: 1.5rem / semibold / tight line-height (subsections)
- **H4**: 1.25rem / semibold / normal line-height (card titles)
- **Body**: 1rem / normal / normal line-height
- **Small**: 0.875rem / normal / normal line-height
- **Caption**: 0.75rem / normal / normal line-height

### Spacing System
- Base unit: 4px (0.25rem)
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px

### Component Patterns

#### Buttons
- Border: 1px solid
- Padding: 12px 24px
- Font: 1rem, medium weight
- No border-radius
- Variants: Primary (filled), Secondary (outlined), Ghost

#### Inputs
- Border: 1px solid #e0e0e0
- Padding: 12px 16px
- Font: 1rem
- No border-radius
- Focus: border-color changes to accent

#### Tables
- Border-collapse: collapse
- Border: 1px solid #e0e0e0 on all cells
- Header: background #f5f5f5
- Padding: 12px 16px per cell
- No rounded corners on table or cells

#### Cards (minimal use)
- Border: 1px solid #e0e0e0
- Padding: 24px
- No shadow, no rounded corners

---

## 4. Page Specifications

### Homepage (`/`)
**Purpose**: Entry point, primary search, SEO landing

**Sections**:
1. Hero
   - H1: "Vehicle Specifications Database"
   - Subtitle: "Explore real vehicle data — free, fast, no login."
   - Primary CTA: Year/Make/Model search
   - Secondary: VIN lookup input

2. Quick Stats (SEO content)
   - Number of vehicles in database
   - Years covered
   - Data points available

3. Popular Searches
   - Links to popular vehicle pages
   - /cars/2024/toyota/camry
   - /cars/2023/ford/f-150
   - etc.

4. About Section
   - Brief explanation of the service
   - Link to full about page

**SEO**:
- Title: "Vehicle Specifications Database | Free VIN Decoder & Car Specs"
- Description: "Search vehicle specifications by year, make, model, or VIN. Free access to comprehensive car data including engine specs, dimensions, fuel economy, and more."
- JSON-LD: WebSite, WebPage

---

### Browse Page (`/cars`)
**Purpose**: Filter and browse vehicles

**Layout**:
- Filter sidebar (on desktop) / top bar (mobile)
- Results table

**Filters**:
- Year (dropdown)
- Make (dropdown, dependent on year)
- Model (dropdown, dependent on make)
- Trim (dropdown, dependent on model)
- Body Type (multi-select)
- Fuel Type (multi-select)

**Results Table Columns**:
- Year
- Make
- Model
- Trim
- Body Type
- Engine
- Fuel Type
- MSRP
- Link to detail

**SEO**:
- Dynamic title based on filters
- Canonical URL with filters
- JSON-LD: ItemList

---

### Year/Make/Model Pages (`/cars/[year]/[make]/[model]`)
**Purpose**: Specific vehicle listings, highly crawlable

**Layout**:
- Breadcrumb navigation
- Page title: "{Year} {Make} {Model} Specifications"
- Filter by trim (if multiple)
- Results table

**SEO**:
- Title: "2024 Toyota Camry Specs, Dimensions, MPG | Vehicle Database"
- Description: "Complete specifications for the 2024 Toyota Camry including engine specs, dimensions, fuel economy, MSRP, and more."
- JSON-LD: ItemList with Vehicle items

---

### Vehicle Detail Page (`/vehicle/[id]`)
**Purpose**: Comprehensive vehicle information

**Sections**:
1. Header
   - Year Make Model Trim
   - Starting MSRP

2. Overview Table
   - Body Type
   - Doors
   - Seats
   - Transmission
   - Drivetrain

3. Engine & Performance Table
   - Engine Type
   - Displacement
   - Horsepower
   - Torque
   - Cylinders
   - Fuel Type

4. Dimensions Table
   - Length
   - Width
   - Height
   - Wheelbase
   - Curb Weight
   - Cargo Capacity

5. Fuel Economy Table
   - City MPG
   - Highway MPG
   - Combined MPG
   - Fuel Tank Capacity

6. Drivetrain Table
   - Transmission Type
   - Number of Speeds
   - Drivetrain Type

**SEO**:
- Title: "2024 Toyota Camry LE Specs & Dimensions | Vehicle Database"
- Description: "Detailed specifications for the 2024 Toyota Camry LE. Engine: 2.5L 4-cylinder, 203 HP. MPG: 28 city / 39 highway. View complete specs."
- JSON-LD: Vehicle (comprehensive)
- Open Graph: vehicle-specific image

---

### VIN Decoder Page (`/vin`)
**Purpose**: Decode VIN numbers

**Layout**:
- Input form (server-side submission)
- Results section (server-rendered)

**Input**:
- VIN input field (17 characters)
- Submit button
- Validation: 17 chars, alphanumeric (no I, O, Q)

**Results**:
- Decoded vehicle summary
- Full specifications table
- Link to vehicle detail page

**SEO**:
- Title: "Free VIN Decoder | Vehicle Identification Number Lookup"
- Description: "Decode any VIN number for free. Get detailed vehicle specifications, manufacturing info, and equipment details. No signup required."
- JSON-LD: WebPage

---

### Compare Page (`/compare`)
**Purpose**: Side-by-side vehicle comparison

**Layout**:
- Vehicle selectors (up to 3)
- Comparison table

**URL Structure**:
- `/compare?vehicles=id1,id2,id3`

**Comparison Table**:
- Rows: All specification fields
- Columns: One per vehicle + label column
- Empty cells for missing data

**SEO**:
- Title: "Compare Vehicles | Side-by-Side Car Comparison"
- Description: "Compare up to 3 vehicles side-by-side. View differences in specs, dimensions, fuel economy, and pricing."
- No index on comparison pages with params (use robots meta)

---

### About Page (`/about`)
**Purpose**: Explain the service, API coverage, transparency

**Sections**:
1. What is this?
2. Data Source (CarAPI.dev)
3. Available Data Points
4. How to Use
5. API Coverage (all endpoints)
6. Privacy (no tracking, no cookies)

**SEO**:
- Title: "About Our Vehicle Database | Data Sources & Coverage"
- Description: "Learn about our free vehicle database. We provide comprehensive car specifications from CarAPI.dev. No accounts, no tracking, completely free."

---

## 5. URL Structure

```
/                                    # Homepage
/cars                                # Browse all vehicles
/cars?year=2024&make=toyota          # Filtered browse
/cars/2024                           # Vehicles by year
/cars/2024/toyota                    # Vehicles by year/make
/cars/2024/toyota/camry              # Vehicles by year/make/model
/vehicle/{id}                        # Vehicle detail page
/vin                                 # VIN decoder
/vin?vin=1HGCM82633A123456           # VIN results
/compare                             # Compare page
/compare?vehicles=id1,id2            # Specific comparison
/about                               # About page
/sitemap.xml                         # Dynamic sitemap
/robots.txt                          # Robots file
```

---

## 6. Data Fetching Strategy

### Server-Side Rendering (SSR)
Used for:
- VIN decoder results (user input required)
- Search results with user filters
- Comparison pages

### Static Site Generation (SSG)
Used for:
- Homepage
- About page
- Popular year/make/model pages (at build time)

### Incremental Static Regeneration (ISR)
Used for:
- Vehicle detail pages
- Year/make/model listing pages
- Revalidate: 24 hours (86400 seconds)

### On-Demand Revalidation
Consider for:
- New vehicle data added to API
- Manual refresh via API route

---

## 7. API Integration (CarAPI.dev)

### Endpoints to Use

```typescript
// Base URL: https://carapi.dev/api

// 1. Years
GET /years
Response: { years: number[] }

// 2. Makes (requires year)
GET /makes?year={year}
Response: { makes: { id, name }[] }

// 3. Models (requires year, make_id)
GET /models?year={year}&make_id={make_id}
Response: { models: { id, name, make_id }[] }

// 4. Trims (requires year, model_id)
GET /trims?year={year}&model_id={model_id}
Response: { trims: { id, name, description, ... }[] }

// 5. Vehicle Details (requires trim_id)
GET /trims/{trim_id}
Response: { id, name, description, msrp, ... }

// 6. VIN Decode
GET /vin/{vin}
Response: { vin, year, make, model, trim, specs... }

// 7. Body Types
GET /body-types
Response: { body_types: { id, name }[] }

// 8. Fuel Types
GET /fuel-types
Response: { fuel_types: { id, name }[] }
```

### API Client Structure

```typescript
// lib/api/carapi.ts
class CarAPIClient {
  private baseUrl = 'https://carapi.dev/api';
  
  async getYears(): Promise<number[]>
  async getMakes(year: number): Promise<Make[]>
  async getModels(year: number, makeId: number): Promise<Model[]>
  async getTrims(year: number, modelId: number): Promise<Trim[]>
  async getTrimDetails(trimId: number): Promise<Vehicle>
  async decodeVin(vin: string): Promise<Vehicle>
  async getBodyTypes(): Promise<BodyType[]>
  async getFuelTypes(): Promise<FuelType[]>
}
```

### Error Handling
- API failures: Return empty data with error message
- Rate limiting: Implement exponential backoff
- Timeout: 10 seconds max
- Fallback: Cache previous successful responses

### Caching Strategy
- Years: 7 days
- Makes: 1 day
- Models: 1 day
- Trims: 1 day
- Vehicle details: 7 days
- VIN decode: 30 days (VINs don't change)

---

## 8. SEO Implementation

### Meta Tags (per page)
```typescript
// lib/seo/meta.ts
interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
}
```

### JSON-LD Structured Data

#### WebSite (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Vehicle Database",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/cars?search={search_term}",
    "query-input": "required name=search_term"
  }
}
```

#### WebPage (All pages)
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description",
  "url": "https://example.com/page"
}
```

#### ItemList (Browse pages)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Vehicle",
        "name": "2024 Toyota Camry"
      }
    }
  ]
}
```

#### Vehicle (Detail page)
```json
{
  "@context": "https://schema.org",
  "@type": "Vehicle",
  "name": "2024 Toyota Camry LE",
  "vehicleModelDate": "2024",
  "manufacturer": {
    "@type": "Organization",
    "name": "Toyota"
  },
  "model": "Camry",
  "vehicleEngine": {
    "@type": "EngineSpecification",
    "engineType": "2.5L inline-4",
    "enginePower": {
      "@type": "QuantitativeValue",
      "value": "203",
      "unitCode": "HP"
    }
  },
  "fuelConsumption": {
    "@type": "QuantitativeValue",
    "value": "28",
    "unitText": "mpg city"
  },
  "offers": {
    "@type": "Offer",
    "price": "25945",
    "priceCurrency": "USD"
  }
}
```

### Sitemap Generation
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Generate static URLs
  // Generate dynamic URLs from popular vehicles
  // Return array of { url, lastModified, changeFrequency, priority }
}
```

### Robots.txt
```
User-agent: *
Allow: /

Disallow: /compare*
Disallow: /vin?*

Sitemap: https://example.com/sitemap.xml
```

---

## 9. Performance Optimizations

### Images
- No decorative images (text-first design)
- Favicon only
- No hero images
- If needed: SVG icons, optimized

### Fonts
- System fonts only (no Google Fonts)
- No font loading scripts

### CSS
- CSS Modules for component styles
- Global CSS for variables and resets
- No CSS-in-JS runtime

### JavaScript
- Minimal client-side JS
- Server components by default
- Client components only for interactivity
- No analytics scripts
- No tracking

### Caching
- Static pages: Cache-Control: public, max-age=31536000, immutable
- ISR pages: Cache-Control: public, s-maxage=86400, stale-while-revalidate=86400
- API responses: Cache in memory + revalidate

---

## 10. Accessibility

### Requirements
- WCAG 2.1 AA compliance
- Semantic HTML5 elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators (visible)
- Skip links
- Alt text for any images
- Color contrast ratio 4.5:1 minimum

### Implementation
- Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`
- Table headers with proper scope
- Form labels associated with inputs
- Error messages linked to inputs
- Focus visible on all interactive elements

---

## 11. Next Steps

1. Initialize Next.js project
2. Set up folder structure
3. Create design system (CSS variables, base components)
4. Implement API client
5. Build pages in order:
   - Layout + Header/Footer
   - Homepage
   - Browse page
   - Vehicle detail page
   - VIN decoder
   - Compare page
   - About page
6. Add SEO components
7. Generate sitemap
8. Test accessibility
