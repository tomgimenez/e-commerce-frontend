# LoreVault Frontend

![React](https://img.shields.io/badge/React-20232A?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)

Modern fantasy-themed fullstack marketplace built with React, NestJS and PostgreSQL. Featuring authentication, admin dashboard and product management.

![Hero Screenshot](./public/readme/hero.png)

---

## Highlights

- Fullstack marketplace architecture using React + NestJS
- JWT authentication with role-based admin access
- Fantasy-themed custom UI inspired by RPG marketplaces
- Responsive checkout and admin dashboard
- PostgreSQL + TypeORM relational backend
- Dockerized backend environment

---

## Live Demo

🔗 [Live Demo](https://lore-vault-market.netlify.app/)

---

## Demo Admin Account

```txt
email: admin@lorevault.com
password: Abc123
```

> Demo mode is enabled. Some destructive actions may be restricted.

---

## Demo Videos

### Shop Experience

https://github.com/user-attachments/assets/fbe5f60a-a739-4768-8e35-c798910e63be

### Admin Panel Experience

https://github.com/user-attachments/assets/15d981d3-069f-4c0e-8325-013c391b07c7

---

## Screenshots

### Home Page

![Home](./public/readme/home.png)

---

### Product Details

![Product Details](./public/readme/product-details.png)

---

### Shopping Cart, Shipping and Payment

![Cart](./public/readme/cart.png)

![Shipping](./public/readme/shipping.png)

![Payment](./public/readme/payment.png)

---

### Admin Dashboard

![Dashboard](./public/readme/dashboard.png)

---

### Product Management

![Product Page](./public/readme/admin-product.png)

![Product Edit](./public/readme/admin-product-edit.png)

---

## Features

* JWT Authentication
* Role-based admin dashboard
* Product CRUD
* Shopping cart
* Responsive UI
* Product search and filtering
* Category system
* Modern UI with Tailwind CSS
* Fullstack architecture

## Roadmap

- Checkout flow UI
- Payment integration
- Order processing

---

## Architecture

Frontend (React + Vite) communicates with a REST API built using NestJS.  
Authentication is handled with JWT tokens and data is persisted in PostgreSQL hosted on Neon.

Netlify → Render → Neon

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Shadcn/UI

### Backend

* NestJS
* PostgreSQL
* TypeORM
* JWT Authentication
* Docker

---

## Infrastructure

Frontend deployed on Netlify  
Backend API deployed on Render  
Database hosted on Neon

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

---

## Run Locally

```bash
npm run dev
```

---

## Testing
 
The project uses **Vitest** as the test runner and **React Testing Library** for component testing, fully integrated with the Vite build pipeline.
 
### Setup
 
Install testing dependencies:
 
```bash
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```
 
Configure Vitest in `vite.config.ts`:
 
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
```
 
Create `src/test/setup.ts`:
 
```ts
import '@testing-library/jest-dom'
```
 
### Run Tests
 
```bash
# Run all tests
npm run test
 
# Watch mode
npm run test -- --watch
 
# Coverage report
npm run test -- --coverage
```

### Adapters
 
Adapters encapsulate all HTTP communication with the API. Tests mock `axios` to verify that requests are built correctly and that responses are mapped as expected — without making real network calls.

### Hooks
 
Custom hooks are tested in isolation using `renderHook` from React Testing Library. Adapter dependencies are mocked so tests focus purely on hook logic: state management, side effects, and return values.

### Actions
 
Actions (form submit handlers, thunks, or context reducers) are tested by invoking them directly and asserting on their side effects — including adapter calls, state updates, and error handling

### Components
 
Components are tested with React Testing Library, which queries the DOM the way a real user would. Network calls and context providers are mocked as needed.

---

## Backend Repository

🔗 [https://github.com/tomgimenez/e-commerce-backend](https://github.com/tomgimenez/e-commerce-backend)

---

## Frontend Repository

🔗 [https://github.com/tomgimenez/e-commerce-frontend](https://github.com/tomgimenez/e-commerce-frontend)

---

## Future Improvements

* Payments integration
* Wishlist system
* Product reviews
* Order history
* CI/CD pipeline
* Image optimization
* Unit and E2E testing

---

## Author

Developed by Tomas Gimenez.
