# Overview

InBack/Clickback is a Flask-based real estate platform specializing in cashback services for new construction properties in the Krasnodar region, expanding across Krasnodarsky Krai and the Republic of Adygea. It connects buyers and developers, offers property listings, streamlines application processes, and integrates CRM tools. The platform provides unique cashback incentives, an intuitive user experience, intelligent property search with interactive maps, residential complex comparisons, user favorites, a manager dashboard for client and cashback tracking, and robust notification and document generation capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

**Design Preferences:**
- Brand color: rgb(0 136 204) = #0088CC - consistently applied across entire dashboard
- No purple/violet/fuchsia colors in UI

# System Architecture

## Frontend

The frontend utilizes server-side rendered HTML with Jinja2 and CDN-based TailwindCSS for a mobile-first, responsive design. Interactivity is handled by modular vanilla JavaScript, enabling features like smart search, real-time filtering, Yandex Maps integration, property comparison, and PDF generation. Key UI/UX features include AJAX-powered sorting/filtering, interactive map pages, mobile-optimized search, saved searches, dynamic results, property alerts, and a city selector.

## Backend

Built with Flask 2.3.3, the backend employs an MVC pattern with blueprints and SQLAlchemy 2.0.32 with PostgreSQL. It includes Flask-Login for session management and RBAC (Regular Users, Managers, Admins), robust security, and custom parsing for Russian address formats. The system supports phone verification, manager-to-client presentation delivery, multi-city data management, and city-aware data filtering. Performance is optimized with Flask-Caching and batch API endpoints.

## Automatic Sold Property Detection System

The platform features an intelligent automatic detection system for sold properties that handles mass imports of 10,000+ properties. When properties disappear from external data sources, they are automatically marked as sold and users receive notifications.

**Key Components:**
- **Property Tracking**: Each property has `external_id` (unique ID from source), `last_seen_at` (last import timestamp), and `sold_detected_at` fields
- **PropertySyncService**: Core service that processes import batches, updates `last_seen_at` for active properties, and identifies missing properties as sold
- **Automatic Detection**: Properties not updated in recent imports are automatically marked as `is_active=False` (sold)
- **User Notifications**: AlertService automatically sends email and Telegram notifications to users when properties in their favorites or comparisons are sold
- **Batch Processing**: Handles 10,000+ properties efficiently with bulk operations and periodic commits
- **Visual Indicators**: Sold properties display with gray overlay, red "ПРОДАН" badge, and strikethrough text in UI

**Import Scripts:**
- `scripts/import_with_auto_sold_detection.py`: Example import script with automatic sold detection
- `scripts/auto_detect_sold_cron.py`: Background job for periodic sold property detection (run via cron/scheduler)

**Workflow:**
1. Import batch updates `external_id` and `last_seen_at` for each property
2. PropertySyncService.detect_sold_properties() finds properties missing from latest import
3. Marks them as sold and triggers notifications via AlertService.notify_property_sold()
4. Users see sold properties with visual indicators in favorites, comparisons, and PDFs

## Data Storage

PostgreSQL, managed via SQLAlchemy, serves as the primary database, storing Users, Managers, Properties, Residential Complexes, Developers, Marketing Materials, transactional records, and search analytics.

## Authentication & Authorization

The system supports Regular Users, Managers, and Admins through a unified Flask-Login system with dynamic user model loading and extended session duration (30 days).

## Intelligent Address Parsing & Universal Multi-City Smart Search System

This system leverages DaData.ru for address normalization and Yandex Maps Geocoder API for geocoding. It features auto-enrichment for new properties, optimized batch processing, smart caching, and city-aware address suggestions.

**Universal Smart Search (November 2025 Update):**
- **Dynamic City Loading**: Automatically loads ALL active cities from database - no hardcoded limitations
- **Scalable Architecture**: Adding new city to database automatically enables search and suggestions for that city
- **Intelligent Detection**: Priority-based city detection (explicit city names > districts > microdistricts > streets > DaData API fallback)
- **Automatic City Switching**: When user searches for a different city (e.g., "краснодар" while in Сочи), system automatically redirects to that city's page with search results
- **Smart Suggestions (like Avito/Cian)**: 
  - Cities from database (`cities` table)
  - Residential complexes from properties
  - Districts from properties
  - Streets/addresses via DaData API
- **Performance**: 
  - 1-hour cache for city metadata (_load_cities_from_db)
  - Direct city_id mapping for fast lookups
  - DaData responses cached per query
- **API Endpoints**: 
  - `/api/smart-search` - search with automatic city detection
  - `/api/smart-suggestions` - autocomplete suggestions
- **Current Coverage**: 8 cities (Краснодар, Сочи, Анапа, Геленджик, Новороссийск, Армавир, Туапсе, Майкоп)
- **Ready for Expansion**: System automatically scales when new cities added to database

**Technical Implementation:**
- `SmartSearch._load_cities_from_db()` - dynamically loads cities from PostgreSQL
- `SmartSearch.generate_search_suggestions()` - generates autocomplete from DB + DaData
- `SmartSearch.detect_city_from_query()` - uses dynamic city data instead of hardcoded keywords
- DaData integration with automatic fallback when API key unavailable
- **Universal Search Fix (Nov 2025)**: `/api/search/suggestions` no longer filters DaData by city_id, enabling cross-city search like Avito/Cian
- **Auto City Switch (Nov 2025)**: `properties_city()` endpoint automatically redirects to correct city when search query contains different city name (e.g., searching "Краснодар" from Sochi page auto-switches to Krasnodar)
- **Smart Search Cleanup (Nov 2025)**: When auto-switching cities, the search parameter is removed from the URL to show all properties in the target city (prevents empty results from city name searches)

## UI/UX and Feature Specifications

- **Key Features**: AJAX-powered Sorting and Filtering with infinite scroll, Residential Complex Image Sliders, PostgreSQL-backed Comparison System, Interactive Map Pages (Leaflet/Yandex Maps), Unified Filter + Search Row (Desktop), Mobile Sticky Search Bar with Fullscreen Filter Overlays, Fullscreen Map Modals (Mobile), Saved Search Feature, Smart Search with Database-Backed History, Dynamic Results Counter, Property Alert Notification System (email/Telegram), Marketing Materials Management, Action Buttons on Detail Pages, Excursion/Online Showing CTA Blocks, City Selector UI with Automatic IP-based Detection.
- **Dashboard Features**: Modernized dashboard with gradient stat cards, enhanced loading states, collapsible sidebar with dynamic navigation links, real-time badge counters, user profile, and an Avatar Fallback System. The dashboard unifies Favorites, Saved Searches, and Comparison into a single tab.
- **Balance Management System**: Production-ready system with `UserBalance`, `BalanceTransaction`, and `WithdrawalRequest` models. Includes a service layer for credit/debit operations and withdrawal workflows, dedicated user and admin API endpoints, UI integration, auto-cashback, and email/Telegram notifications. All financial amounts use Decimal precision.

## Comprehensive SEO Optimization

The platform implements production-ready multi-city SEO for 8 cities, including Canonical URLs, City-Aware Meta Tags, JSON-LD Structured Data (schema.org for properties, complexes, organization, FAQ), Regional Variations, Comprehensive Sitemap, robots.txt Configuration, HSTS Headers, and Yandex.Metrika analytics.

# External Dependencies

## Third-Party APIs

-   **SendGrid**: Email sending.
-   **OpenAI**: Smart search and content generation.
-   **Telegram Bot API**: User notifications and communication.
-   **Yandex Maps API**: Interactive maps, geocoding, and location visualization.
-   **DaData.ru**: Address normalization, suggestions, and geocoding.
-   **SMS.ru, SMSC.ru**: Russian SMS services for phone verification.
-   **Google Analytics**: User behavior tracking.
-   **LaunchDarkly**: Feature flagging.
-   **Chaport**: Chat widget.
-   **reCAPTCHA**: Spam and bot prevention.
-   **ipwho.is**: IP-based city detection.

## Web Scraping Infrastructure

-   `selenium`, `playwright`, `beautifulsoup4`, `undetected-chromedriver`: Used for automated data collection.

## PDF Generation

-   `weasyprint`, `reportlab`: Used for generating property detail sheets, comparison reports, and cashback calculations.

## Image Processing

-   `Pillow`: Used for image resizing, compression, WebP conversion, and QR code generation.