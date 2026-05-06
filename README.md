# ⛽ Nirig Gas — Fuel Station Inventory Management System

A complete, professional inventory management system for gas and fuel stations.

**Stack:** Next.js 14 · TypeScript · PostgreSQL · Prisma · ShadcnUI · TailwindCSS

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally or on cloud (Neon, Supabase, Railway)
- Git

### 2. Install dependencies
```bash
cd nirig-gas
npm install
```

### 3. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/nirig_gas"
NEXTAUTH_SECRET="your-long-random-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup database
```bash
# Generate Prisma client
npm run db:generate

# Run migrations (creates all tables)
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Default Login Credentials

| Role    | Email                    | Password     | Access |
|---------|--------------------------|--------------|--------|
| Admin   | admin@niriggas.com       | admin123     | Full system access |
| Cashier | cashier@niriggas.com     | cashier123   | Sales + customers |
| Seller  | seller@niriggas.com      | seller123    | Inventory view + alerts |

> ⚠️ Change passwords after first login in production!

---

## 📁 Project Structure

```
nirig-gas/
├── prisma/
│   ├── schema.prisma          # Database schema (all models)
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── admin/             # Admin dashboard & all pages
│   │   │   ├── page.tsx       # Dashboard with charts
│   │   │   ├── inventory/     # Stock management + tank gauges
│   │   │   ├── restock/       # Receive fuel from suppliers
│   │   │   ├── transactions/  # All transactions + receipts
│   │   │   ├── customers/     # Customer accounts & credit
│   │   │   ├── suppliers/     # Supplier management
│   │   │   ├── expenses/      # Operating costs
│   │   │   ├── reports/       # Financial summaries
│   │   │   ├── stock-history/ # Fuel movement audit trail
│   │   │   ├── users/         # Staff management
│   │   │   ├── export/        # CSV data exports
│   │   │   └── settings/      # System configuration
│   │   ├── cashier/           # Cashier dashboard & pages
│   │   │   ├── page.tsx       # Dashboard with today's stats
│   │   │   ├── sale/          # POS — new fuel sale
│   │   │   ├── transactions/  # My transactions history
│   │   │   ├── customers/     # View/add customers
│   │   │   ├── inventory/     # Price list view
│   │   │   └── shift/         # Open/close shift + summary
│   │   ├── seller/            # Seller dashboard & pages
│   │   │   ├── page.tsx       # Overview + alerts
│   │   │   ├── inventory/     # Detailed tank levels
│   │   │   └── alerts/        # Stock & system alerts
│   │   ├── login/             # Auth page
│   │   └── api/               # All API routes
│   │       ├── auth/          # NextAuth
│   │       ├── products/      # Fuel products CRUD
│   │       ├── transactions/  # Sales + restock processing
│   │       ├── customers/     # Customer CRUD
│   │       ├── suppliers/     # Supplier CRUD
│   │       ├── users/         # Staff management
│   │       ├── expenses/      # Expense CRUD
│   │       ├── shifts/        # Shift management
│   │       ├── alerts/        # Alerts CRUD
│   │       ├── stock-movements/ # Stock audit
│   │       ├── reports/       # Reports data
│   │       ├── export/        # CSV export
│   │       └── dashboard/     # Dashboard stats
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Role-based navigation
│   │   │   └── Header.tsx     # Top bar with dark mode toggle
│   │   ├── ui/
│   │   │   ├── StatsCard.tsx  # Metric cards
│   │   │   └── TankGauge.tsx  # Visual tank level indicator
│   │   ├── charts/
│   │   │   ├── RevenueChart.tsx
│   │   │   └── FuelBreakdownChart.tsx
│   │   ├── tables/
│   │   │   └── RecentTransactions.tsx
│   │   ├── forms/
│   │   │   └── AddCustomerForm.tsx
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── SessionProvider.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── utils.ts           # Helpers (format, generate invoice, etc.)
│   │   ├── rateLimit.ts       # API rate limiting
│   │   ├── apiHelpers.ts      # withAuth wrapper
│   │   └── pdfReceipt.ts      # Receipt HTML generator
│   ├── middleware.ts           # Route protection (role-based)
│   └── types/index.ts         # TypeScript types
```

---

## 🗄️ Database Models

| Model          | Purpose                                         |
|---------------|-------------------------------------------------|
| User          | Staff accounts with roles (Admin/Cashier/Seller)|
| FuelProduct   | Fuel types, tanks, stock levels, prices         |
| Supplier      | Fuel delivery companies                         |
| Customer      | Customer accounts with credit management        |
| Transaction   | All sales and restock transactions              |
| TransactionItem| Line items for each transaction                |
| StockMovement | Audit trail of all fuel movements               |
| PriceHistory  | Track price changes over time                   |
| Shift         | Cashier work shifts with opening/closing cash   |
| Alert         | Low stock and system notifications              |
| Expense       | Operating costs (salaries, utilities, etc.)     |

---

## 👥 Role Permissions

| Feature              | Admin | Cashier | Seller |
|---------------------|:-----:|:-------:|:------:|
| View Dashboard      | ✅    | ✅      | ✅     |
| Process Sales       | ✅    | ✅      | ❌     |
| View Inventory      | ✅    | ✅      | ✅     |
| Edit Inventory      | ✅    | ❌      | ❌     |
| Restock Fuel        | ✅    | ❌      | ❌     |
| Manage Customers    | ✅    | ✅      | ❌     |
| Manage Suppliers    | ✅    | ❌      | ❌     |
| View Transactions   | ✅    | Own only| ❌     |
| Manage Expenses     | ✅    | ❌      | ❌     |
| View Reports        | ✅    | ❌      | ❌     |
| Export Data         | ✅    | ❌      | ❌     |
| Manage Users        | ✅    | ❌      | ❌     |
| View Alerts         | ✅    | ❌      | ✅     |
| Shift Management    | ✅    | ✅      | ❌     |

---

## ⚡ Key Features

### Inventory Management
- Real-time tank level visualization with color-coded gauges
- Automatic low-stock alerts when below minimum threshold
- Complete stock movement audit trail
- Price history tracking

### Sales (POS)
- Multi-product sale in one transaction
- Discount support (percentage)
- Credit sales with balance tracking
- Multiple payment methods: Cash, Bank Transfer, Cheque, Credit
- Auto invoice number generation
- Printable receipt via browser

### Reporting
- Daily, weekly, monthly revenue summaries
- Fuel breakdown by type (pie chart)
- Revenue vs expense trend (area chart)
- Top-selling products ranking
- CSV export for all data types

### Security
- JWT-based authentication with NextAuth
- Role-based access control (middleware + API level)
- Rate limiting on all API routes (200 req/min per IP)
- Passwords hashed with bcrypt (12 rounds)

### Dark Mode
- Full dark/light mode support via next-themes
- System preference detection
- Toggle in every header bar

---

## 🏗️ Production Deployment

### Environment Variables (Production)
```env
DATABASE_URL="postgresql://user:pass@your-cloud-db/nirig_gas"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="use-openssl-rand-base64-32-output"
```

### Build & Start
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
npx vercel --prod
```
Add all env variables in Vercel dashboard.

### Database (Recommended cloud options)
- **Neon** (free tier, serverless PostgreSQL)
- **Supabase** (free tier, PostgreSQL)
- **Railway** (simple PostgreSQL hosting)

---

## 📜 NPM Scripts

| Command             | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`       | Start development server             |
| `npm run build`     | Build for production                 |
| `npm run start`     | Start production server              |
| `npm run db:generate` | Generate Prisma client             |
| `npm run db:migrate`  | Run database migrations            |
| `npm run db:seed`     | Seed demo data                     |
| `npm run db:studio`   | Open Prisma Studio (DB GUI)        |
| `npm run db:reset`    | Reset DB + re-seed                 |

---

## 💡 Tips

- Use `npm run db:studio` to visually browse your database
- Receipt printing opens in a new tab and triggers browser print dialog
- Low stock alerts are auto-created when a sale reduces stock below minimum
- Credit customers accumulate balance — track via Customers page

---

**Nirig Gas System** — Built for professional fuel station management 🔥
# Nirig_Gas
