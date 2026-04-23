# ShopHub — E-commerce mock (React + Vite)

ShopHub is a lightweight e-commerce demo app built with React and Vite. It includes product browsing, product details, a cart/checkout flow, and a simple auth UX (client-side) to demonstrate common patterns (routing, context state, forms).

## Features
- **Product listing**: Grid view of products.
- **Product details**: Dedicated page per product.
- **Cart + checkout**: Add items, adjust quantity, remove items, view totals, and place an order.
- **Auth screen**: Login/Signup UI built with React Hook Form (client-side only).
- **Modern UI**: Custom CSS with design tokens (dark-modern theme).

## Tech stack
- **React 19** + **Vite**
- **React Router** for routing
- **Context API** for app state (`AuthContext`, `CartContext`)
- **React Hook Form** for form handling/validation
- **ESLint** for linting

## Getting started
### Prerequisites
- Node.js (LTS recommended)

### Install & run
```bash
npm install
npm run dev
```

### Build & preview production build
```bash
npm run build
npm run preview
```

### Lint
```bash
npm run lint
```

## Project structure 
```text
src/
  assets/               # Static assets
  components/           # Reusable UI components (Navbar, ProductCard)
  context/              # Global state (AuthContext, CartContext)
  data/                 # Product data source (in-memory)
  pages/                # Route pages (Home, Auth, Checkout, ProductDetails)
  App.jsx               # App shell + routes
  App.css               # Component/page styles
  index.css             # Global tokens + base styles (theme)
  main.jsx              # React entrypoint + router setup
```

## State + data notes
- **Products** are currently sourced from `src/data/` (in-memory). There’s no backend/API.
- **Auth** is implemented as a client-side flow via `src/context/AuthContext.jsx` (intended for demo purposes).
- **Cart state** lives in `src/context/CartContext.jsx`, which computes totals and item quantities.

## Styling/theme
- Global design tokens (colors, surfaces, spacing, radii, shadows, focus rings) live in `src/index.css`.
- Component/page styles consume those tokens from `src/App.css`.

## Next improvements (ideas)
- Persist cart/auth to `localStorage` (or integrate a real backend).
- Add search, filtering, and sorting on the product grid.
- Add route guards for checkout (require auth).
- Add tests (Vitest + React Testing Library).
