# Robin Business Hub - Handover Document

## 1. Executive Summary
The **Robin Business Hub** is a dual-purpose web platform built to serve as both a high-end, public-facing personal brand/services portfolio, and a secure internal ERP & CRM system (Robin Business Operating System or "RBOS") for managing business operations. The platform facilitates end-to-end business flows from public lead capture on the website to project delivery and invoicing in the secure admin dashboard.

## 2. Tech Stack Overview
- **Framework**: Next.js 15.5 (App Router)
- **Library**: React 19.1
- **Language**: TypeScript
- **Database**: PostgreSQL (managed via Prisma ORM v6)
- **Styling**: Standard CSS, CSS Modules (for component-scoping)
- **State & Forms**: React Hook Form, Zod (schema validation)
- **Editor**: Tiptap Rich Text Editor (for blog and content management)
- **Charting**: Recharts (for dashboard analytics)
- **PDF Generation**: HTML2PDF.js (for invoices)
- **Authentication**: Custom JWT implementation (`jose` library) via HTTP-only cookies

## 3. Platform Architecture
The codebase follows a highly scalable **Feature-Sliced Architecture** alongside standard Next.js App Router conventions:

- `src/app`: Contains the routing and page layer.
  - **Public routes**: `/home`, `/about`, `/portfolio`, `/blog`, `/events`, `/services`, `/contact`.
  - **Admin routes**: `/(admin)` houses the backend CRM/ERP system.
  - **API routes**: `/api` endpoints structured logically (`/api/auth`, `/api/crm`, `/api/ops`, `/api/content`).
- `src/features`: Domain-specific business logic, UI components, validation schemas, and API client abstractions. Divided dynamically into modules like `clients`, `events`, `invoices`, `leads`, `projects`, `tasks`, `portfolio`, and `blog`.
- `src/shared`: Generic, shared elements including reusable UI components, styling layouts, and utility functions (e.g., `lib/jwt.ts`).
- `src/middleware.ts`: Secures the application by checking and verifying custom JWT tokens on all protected API and admin routes before proceeding.

## 4. Database Schema (Prisma)
The database structure supports the full business lifecycle. 
- **CRM Domain**: `Admin` (Users), `Lead`, `Client`
- **Operations Domain**: `Project`, `Task`, `TimeEntry`
- **Finance Domain**: `Invoice`
- **Content / Public Domain**: `Event`, `Attendee`, `PortfolioItem`, `BlogPost`, `Notification`

*Note on Data Integrity*: A **Soft-Delete Architecture** is implemented across most core models (utilizing the `isDeleted: Boolean` field). This mechanism prevents accidental data loss and allows for "Trash" bin functionality where records can safely be restored or permanently purged by the Admin.

## 5. Developer Base: Codebase & Implementation Details
For incoming developers maintaining or expanding the system, here are the core functional patterns implemented:

### Authentication Sequence
1. Admin logs in at `/login`.
2. The `/api/auth/login` endpoint validates credentials against the `Admin` database model.
3. Upon success, a stateless JWT token is generated utilizing the `jose` library and mapped into an HTTP-only cookie (`rbos_token`), protecting against XSS attacks.
4. Next.js Middleware intercepts route changes to ensure the token remains valid for all protected routes, kicking back to `/login` if expired or manipulated.

### Form Handling & Payload Validation
- Built consistently using `react-hook-form` coupled with `@hookform/resolvers/zod`.
- Zod validation schemas are colocated with their specific feature (e.g., `src/features/leads/schema.ts`).
- Guarantees strict end-to-end typing between front-end UI submissions and backend API payload processing.

### UI & Styling Strategy
- Bypasses utility-heavy frameworks (like Tailwind) in favor of modular vanilla CSS and CSS Modules.
- Employs standardized layout wrappers to ensure responsive design (e.g., Mobile flex-column stacking optimizations for Data Tables and Dashboard metrics).

### Key Features Under the Hood
1. **Rich Text Editing**: Powered by `Tiptap`. Configurations include plugin extensions for placeholders, dynamic alignment, image embedding, standard text stylings, and bubble menus to allow nuanced construction of portfolio and blog pages.
2. **Dynamic PDF Invoices**: Renders a React component dynamically capturing billable `TimeEntries`, which is cleanly converted to a PDF via `html2pdf.js` strictly on the client browser.
3. **Draft vs. Published System**: CMS data models leverage a `status` field, authorizing Admins to draft complex content natively before pushing it live to the SSR web frontend.

## 6. User Base: End-to-End Workflows

### The Public Visitor (Client/Lead) Workflow
1. **Brand Engagement**: Visitors browse high-end portfolio components, read SEO-friendly thought leadership articles, and examine service offerings. The UI applies a polished, modern design system spanning across devices.
2. **Inbound Lead Generation**: A visitor inputs information into an inquiry or contact form.
3. **Data Recording**: Form submission populates the `Lead` table mapped with the 'Expected Value' and 'Source' metrics.
4. **Event Registration**: Visitors can open dynamic Event landing pages and submit a registration application, locking them natively as an `Attendee` attached to a specific `Event` in the backend.

### The Admin (Operator) Workflow
1. **Lead Conversion**: The Admin logs in, surveys active `Lead` entries natively in the CRM dashboard, and converts qualified targets directly into active `Client` assets.
2. **Project Initiation**: For newly formalized clients, the Admin spins up a `Project`, establishing categories, objectives, and high-level deliverables.
3. **Task & Time Tracking**: Projects are broken down dynamically into `Task` records. As internal work is completed, the Admin creates `TimeEntry` stamps, labeling them as billable/non-billable, tying them directly mapping backwards to the Task/Project.
4. **Invoicing & Billing cycle**: Concluding billing periods, the Admin executes an `Invoice` generation for a `Client`, automatically querying and pulling remaining unbilled `TimeEntry` allocations. The invoice is locked and seamlessly downloaded as a verified PDF representation.
5. **Content Management**: An Admin leverages the rich-text CMS segment to coordinate Content Blocks (Portfolio, Blogs, Events), publishing dynamically straight to the main frontend layout.

## 7. Project Journey: Start to Finish (What Was Done)
The development of RBOS followed a precise multi-phase journey to build a robust, interconnected system out of a standard web setup.

- **Phase 1: Brand & Portfolio Foundation**: Started by designing a premium UI, refining typography (using standard high-end fonts like Fraunces and IBM Plex), and constructing robust bento-box styled layouts. Mobile responsiveness and cross-browser fixes (like HTML syntax repairs for external links) were established early.
- **Phase 2: Architecture Migration**: Transitioned from standard monolithic HTML templates into a strict Next.js Feature-Sliced modular architecture. Secured the underlying architecture to prep for backend logic.
- **Phase 3: CMS Integration**: Moved from static placeholders into a dynamic Server-Side Rendered (SSR) environment. Built out the internal Tiptap Rich Text editor, allowing true dynamic Event and Blog data creation internally to immediately reflect on the public timeline.
- **Phase 4: CRM & Internal Operations**: Built the internal Admin backbone. This included wiring Prisma models to Next.js API boundaries to allow Lead tracking, qualification, Project creation, and an Admin-to-User verification loop for operational tasks.
- **Phase 5: Finance & Invoicing**: Engineered the real-time invoice generation system. Time tracking was tethered to tasks/projects to seamlessly aggregate billable hours, convert them strictly to PDF via `html2pdf.js`, and wrapped entirely inside a safe soft-delete architecture (Trash & Restore).
- **Phase 6: Polish & Deployment**: Resolved major UI bugs on mobile (e.g. Dashboard layout stacking), removed early development password-locks on the public portfolio, configured GitHub integration, and fully prepared the Next.js/Prisma schema for aggressive Vercel deployment.

## 8. Future Plans & Roadmap
The architecture established in RBOS opens the door for several powerful upgrades and automations that the owner can pursue as the business scales:

### 1. Expanded Security & Multi-Role Architecture
Currently locked behind a single Admin role. In the future, the JWT verification flow and Prisma model can be expanded to include:
- **Staff/Editor Roles**: Allowing writers to access only the CMS (Blog/Portfolio) to draft articles without touching Financial data.
- **Client Portal**: Creating a logged-in ecosystem for `Clients` where they can view their `Projects`, see live `Tasks`, and directly download generated `Invoices` without manual email transmission.

### 2. External Service Integrations
- **Payment Processing**: Hooking the `Invoice` model natively to **Stripe API**. This would embed checkout links directly on the PDF or an emailed invoice URL to auto-resolve `Invoice` statuses upon payment.
- **Email Automation**: Integrating **SendGrid** or **Postmark**. For example, automating a 'Welcome Email' upon Event registration, or alerting an Admin when a new Lead enters the pipeline.
- **Calendar Hookups**: Syncing the internal `Event` and `Task` schedules natively with Google Calendar via OAuth.

### 3. Advanced Analytics Engine
Currently, basic metric visuals run on Recharts. The schema is rich enough to build:
- **Profitability Dashboards**: Visualizing tracked `TimeEntry` versus actual `Invoice` collection over months to calculate exact margins.
- **Lead Source Conversion Rates**: Automatically tracking which "Sources" (e.g., LinkedIn, Organic) lead to the most converted `Clients`, powering better marketing spends.

### 4. Advanced Media Management
As the Blog and Portfolio expand, bridging Next.js to an AWS S3 bucket or Cloudinary infrastructure will create a central Media Library native to the Admin dashboard, removing the need for external image hosting.
