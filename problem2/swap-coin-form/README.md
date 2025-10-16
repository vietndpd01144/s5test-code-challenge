# Swap Coin Form

A simple currency swap interface built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui + React Hook Form + Zod**.
It allows users to swap tokens, shows the exchange rate, estimated output, and transaction fee based on real-time token prices.

---

## 🚀 Features

* Real-time token prices from [https://interview.switcheo.com/prices.json](https://interview.switcheo.com/prices.json)
* Automatic calculation of:

  * Exchange rate
  * Estimated received amount
  * Fee percentage and total fee
* Token selection with logos
* Responsive, modern UI built with shadcn/ui components

---

## 📦 Installation

Make sure you have **Node.js ≥ 18** installed.

```bash
# Install dependencies
yarn
# or
npm install
```

---

## 🧑‍💻 Development

Start the development server:

```bash
yarn dev
# or
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📦 Build for Production

```bash
yarn build
# or
npm run build
```

Preview the build locally:

```bash
yarn preview
# or
npm run preview
```

---

## 📁 Project Structure

```
src/
├─ App.tsx              # Main logic & calculations
├─ components/
│  └─ SwapCard.tsx     # Main UI component
├─ lib/                # Price fetching and helper functions
├─ schemaValidations/  # Zod validation schemas
└─ index.css           # Tailwind CSS styles
```

---

## 🪙 How It Works

1. Choose the token you want to send and the token you want to receive.
2. Enter the amount to swap.
3. The app calculates:

   * Exchange rate
   * Estimated received amount
   * Fee percentage and total fee
4. Click **Swap** to simulate the transaction.

---

## 🔗 APIs & Assets

* **Prices:** [https://interview.switcheo.com/prices.json](https://interview.switcheo.com/prices.json)
* **Token Icons:** [Switcheo Token Icons](https://github.com/Switcheo/token-icons)

---
