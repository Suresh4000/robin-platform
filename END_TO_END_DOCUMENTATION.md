# Robin Business Hub - End-to-End Documentation

## 1. Project Overview
**Robin Business Hub** is a premium, full-stack Next.js web application designed to serve as both a public-facing reputation asset (portfolio, thought leadership, event registrations) and a complete back-office operational dashboard (admin). 

The platform handles everything from dynamic web content and lead generation to complex internal workflows like task management, client billing, and invoice generation.

## 2. Tech Stack & Architecture
- **Framework:** Next.js (TypeScript) 
- **Database / ORM:** PostgreSQL managed via Prisma ORM (`prisma schema`)
- **Styling:** CSS Modules (`.module.css`) combined with standard CSS variables for a structured design system.
- **Deployment:** Vercel (Production-ready)
- **Key Libraries:** `lucide-react` (icons), `html2pdf.js` (client-side PDF generation)

## 3. Core Modules & Features

### 3.1 Public-Facing Platform
- **Dynamic Homepage & Portfolio:** High-end, responsive "bento-box" style layout showcasing the Robin Jones brand. Driven by Server-Side Rendering (SSR) for immediate performance and SEO.
- **Events & Blog Integration:** Dynamic detail pages for events and thought leadership articles. Includes custom event registration forms that handle capacity limits seamlessly.
- **Career & Brand Positioning:** Interactive, accordion-based timelines detailing Executive & Operating Leadership history.
- **Navigation & CTAs:** Fully mobile-responsive glassmorphic menu and routed CTAs optimized for conversion.

### 3.2 Admin Dashboard (Back-Office Operations)
The secured `/ops` administrative dashboard provides total control over business operations:
- **Invoice Management (`/ops/invoices`)**
  - **Generation:** End-to-end invoice portal tied to client project time entries.
  - **Lifecycle:** Track statuses (Draft, Sent, Paid, Overdue).
  - **PDF Export:** Allows Admins to download formatted PDF invoices directly via `html2pdf`.
  - **Soft/Hard Deletes:** Secure data tiering with "Trash" views so deleted invoices can be easily restored or permanently deleted.
- **Lead Pipeline (`/ops/leads`)**
  - Interactive pipeline to track potential clients.
  - Features quick document upload modals and auto-complete inputs.
- **Client & Project Management**
  - Categorized management of active projects and client onboarding. Includes robust soft-delete/restore architecture across relationships.
- **Task Workflow System**
  - Modular, role-based task delegation.
  - Admins can instruct, review, and verify completed tasks before final completion.
- **Content Management**
  - Internal CMS functionality for creating events and blog posts, which push directly to the public site.

## 4. Workflows

### 4.1 Invoice Generation Workflow
1. **Time Tracking:** Work hours are logged dynamically via the Time Entries view and tied to a Client/Project.
2. **Drafting:** An Admin navgiates to "Invoices" and clicks "Generate Invoice". The system aggregates time logs.
3. **Review & Print:** The invoice is generated and can be previewed in the `InvoicePrintView`.
4. **Download:** Admin clicks "Download PDF" (handled purely client-side to prevent SSR server crashes). 
5. **State Management:** Admin changes invoice status to "Sent" or "Paid" as appropriate.

### 4.2 Content Publishing Workflow
1. Admin creates a new Event or Blog via the dashboard interfaces.
2. The Database is updated via a Next.js Server Action or API Route.
3. The Public pages instantly reflect changes via dynamic SSR paths, allowing users to register or read immediately.

## 5. Development & Deployment
- **Local Dev:** Run `npm run dev` to start the local Next.js server. 
- **Database Sync:** Run `npx prisma db push` or `npx prisma migrate dev` to update the database schema.
- **Build & Deploy:** The project is configured for Vercel. Running `npm run build` locally verifies production readiness (runs Prisma generate, type checks, and compiles).

## 6. Recent Technical Resolutions
- Optimized mobile responsiveness (Flex columns and horizontal-scrolling data tables) in the Admin UI.
- Secured robust PDF generation by dynamically importing `html2pdf.js`, avoiding Next.js `window/self` rendering crashes.
- Fixed literal unicode character (`\x60`) parsing errors in internal API fetches to guarantee solid network requests.
