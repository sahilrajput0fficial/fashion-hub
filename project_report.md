# Fashion Hub — Project Report
**Prepared by:** 
**Project:** Fashion Hub — The Digital Atelier E-Commerce Platform

---

---

# Page 1 — What Is This Project?

## The Big Picture

Imagine you walk into a high-end fashion boutique. You browse the racks, pick items you like, try them on, add them to a basket, and then pay at the counter. When you're done, the store keeps a record of your purchase, and you can check your order history anytime.

**Fashion Hub** is exactly that — but on the internet.

It is a fully working online fashion store where customers can:

- Browse a curated collection of premium clothing and accessories
- Click on any product to see its full details, choose a size, and add it to their bag
- Review everything in their shopping cart and calculate the total cost
- Create a personal account, log in securely, and view past orders
- Experience a beautifully designed, premium website — as polished as any luxury brand online

This is not just a pretty design. Every button works. Every price is real. Every product comes from a live database. It is a complete, production-ready web application.

## Who Is It For?

| Type of User | What They Can Do |
|---|---|
| **Shopper (Guest)** | Browse products, view product details, add items to cart |
| **Registered User** | All guest features + sign in, view order history, manage profile |
| **Administrator** | All user features + manage products (add, edit, delete), monitor orders |

## The Technology Stack (In Simple Terms)

Think of a website like a restaurant:

- 🍽️ **The dining room** (what you see) = **Frontend** — the beautiful pages, colors, buttons
- 🍳 **The kitchen** (what processes your order) = **Backend** — the server that handles requests
- 📦 **The pantry/storage** (where data is kept) = **Database** — MongoDB

Together these three things make the website function.

---

---

# Page 2 — The Website (What You See)

## The Frontend — The "Face" of the Shop

The frontend is everything the visitor sees and interacts with. Think of it as the interior design, signage, and display windows of a physical boutique.

Fashion Hub has **6 beautifully designed pages**:

---

### 🏠 1. The Home Page (`fashionhub.com/`)

This is the front entrance. When someone visits, they see:

- A dramatic **hero image** — a large, full-screen editorial fashion photograph
- A **"Shop Now"** button that takes them to the catalog
- A **"Trending Now"** section showing the most popular items — these are loaded live from the database
- A **newsletter signup** section
- A consistent **navigation bar** at the top with links to Catalog, Sign In, and the shopping bag icon

The cart icon in the top corner shows a **live count** of how many items are in the bag. This number updates instantly whenever something is added.

---

### 📋 2. The Catalog Page (`/catalog`)

This is the main shopping floor. All available products are displayed here in an elegant grid layout.

- Each product card shows the **image, category, name, and price**
- Hovering over a product reveals a **quick "Add to Bag" button** — so the shopper can add items without leaving this page
- Clicking anywhere on the product card opens the **full product detail page**
- All product data is fetched live from the database when the page loads

---

### 👗 3. The Product Detail Page (`/product?id=...`)

This is like picking an item off the rack and inspecting it closely.

- A large **product image** with zoom effect on hover
- The product's **full description, category, price, and stock level**
- A **size selector** (XS, S, M, L, XL) — the chosen size is remembered
- A **quantity counter** to choose how many to buy
- A prominent **"Add to Bag"** button — when clicked, a toast notification slides in from the bottom confirming the item was added
- A **"Related Products"** section at the bottom, showing other items from the catalog

---

### 🛒 4. The Shopping Cart Page (`/cart`)

This is the checkout counter. The shopper sees everything they've selected.

- A **list of all cart items** with image, name, size, and price per item
- Controls to **increase or decrease quantity** of each item, or **remove it entirely**
- A live **price summary** panel showing:
  - Subtotal (sum of all items)
  - Estimated Tax (8% of subtotal)
  - Shipping ($15 flat)
  - **Grand Total**
- A "Place Order" button (redirects to login if not signed in)

---

### 🔐 5. The Login / Register Page (`/login`)

A clean, split-screen page:

- The **left side** shows an elegant quote and the brand name
- The **right side** has a **tab switcher** between "Sign In" and "Create Account"
- Sign In asks for email and password — the system checks against the database and issues a secure token
- Register asks for name, email, and password — the password is automatically encrypted before being stored
- On success, the shopper is redirected to their Account page

---

### 👤 6. The Account Page (`/account`)

A personal dashboard for the logged-in user.

- Shows a welcome message with the user's name
- **Order History tab** — lists all past orders with status (Pending / Processing / Delivered)
- **Profile tab** — lets the user update their display name
- **Admin panel** (only visible to administrators) — shows a full product table with the ability to add or delete products
- A **Sign Out** button that clears the session

---

---

# Page 3 — The Backend (The "Engine Room")

## What Is a Backend?

When a shopper clicks "Add to Bag," something needs to respond, save data, and confirm the action. That "something" is the **backend** — the hidden engine that powers everything.

In Fashion Hub, the backend is built using **Node.js** (a programming environment) and **Express.js** (a tool for building web servers).

Think of the backend as a very efficient manager standing behind a one-way glass. The customer never sees them, but every request the customer makes goes through this manager, who finds the right answer and sends it back.

## How Requests Work (Step-by-Step)

> 💡 **Example:** A user clicks "Add to Bag" on the Catalog page.
>
> 1. The button on the webpage sends a message to the server: **"Save this item"**
> 2. The server receives the message
> 3. The server talks to the database to retrieve or save information
> 4. The server sends back a confirmation: **"Done. Item added."**
> 5. The webpage updates the cart counter without reloading the page

This entire exchange happens in **under a second**.

## The API — The "Language" Between Frontend and Backend

The frontend (what you see) and the backend (the engine) communicate using an **API** (Application Programming Interface). Think of it as a menu at a restaurant — the waiter (API) carries orders from the table (frontend) to the kitchen (backend) and brings the food back.

Fashion Hub's API has these "menu items":

| What You're Asking | API Endpoint | Who Can Use It |
|---|---|---|
| Get all products | `GET /api/products` | Everyone |
| Get one product | `GET /api/products/:id` | Everyone |
| Create a product | `POST /api/products` | Admin only |
| Update a product | `PUT /api/products/:id` | Admin only |
| Delete a product | `DELETE /api/products/:id` | Admin only |
| Register new user | `POST /api/users` | Everyone |
| Login | `POST /api/users/login` | Everyone |
| Get my cart | `GET /api/cart` | Logged-in users |
| Add to cart | `POST /api/cart` | Logged-in users |
| Place an order | `POST /api/orders` | Logged-in users |
| My order history | `GET /api/orders/myorders` | Logged-in users |

---

---

# Page 4 — The Database (Where Everything Is Stored)

## What Is a Database?

A database is like a **digital filing cabinet**. Instead of paper folders, it stores information in organised tables (called "collections" in MongoDB). Every time someone registers, places an order, or buys a product — that information is neatly stored and can be retrieved whenever needed.

Fashion Hub uses **MongoDB** — a modern, flexible database that stores information in a format similar to organised lists.

## The Four Main "Filing Cabinets" (Collections/Schemas)

---

### 📦 Product Collection

This is the product catalogue — every item available in the store.

| Field | What It Means | Example |
|---|---|---|
| `name` | The name of the product | "Structured Wool Overcoat" |
| `price` | How much it costs (in $) | 1250 |
| `description` | A description of the piece | "A masterpiece crafted from premium Italian wool" |
| `image` | A link to the product photo | (web link) |
| `category` | What type of item it is | "Outerwear" |
| `stock` | How many are available | 10 |
| `trending` | Is it currently featured? | Yes / No |

> 💡 When an admin adds a new product through the website, a new "card" is created in this filing cabinet instantly.

---

### 👤 User Collection

This stores everyone who has created an account.

| Field | What It Means | Example |
|---|---|---|
| `name` | The user's full name | "Sahil Rajput" |
| `email` | Their email address | "sahil@example.com" |
| `password` | Their password — **encrypted** | (cannot be read, ever) |
| `role` | Are they a regular user or admin? | "user" or "admin" |

> 🔒 **Important:** Passwords are never stored as plain text. They are scrambled using a process called "hashing" — even the developers cannot see what your password is.

---

### 🛒 Cart Collection (for logged-in users)

When a logged-in user adds items to their cart, those items are saved in the database — so their cart persists even if they close the browser.

| Field | What It Means |
|---|---|
| `user` | Which user this cart belongs to |
| `cartItems` | A list of products, each with name, image, price, and quantity |

> 💡 For guest users (not logged in), the cart is stored temporarily in the browser's local memory.

---

### 📋 Order Collection

Every completed purchase is saved as an order. This is the permanent purchase record.

| Field | What It Means | Example |
|---|---|---|
| `user` | Who placed the order | Link to user record |
| `orderItems` | Which products were bought | List of pieces |
| `shippingAddress` | Where to deliver | Street, city, country |
| `paymentMethod` | How they paid | "Credit Card" |
| `taxPrice` | Tax charged | $112.00 |
| `totalPrice` | Final amount | $1,527.00 |
| `isPaid` | Has payment been received? | Yes / No |
| `isDelivered` | Has it been sent? | Yes / No |

---

---

# Page 5 — The Seven Functional Modules

The project is divided into **7 independent modules** — like departments in a company. Each department has a clear job.

---

## Module 1 — User Management 👤
**Department:** Front Desk / Reception

This module handles everything about people:
- Welcoming new customers (Registration)
- Verifying identity at the door (Login)
- Issuing a secure visitor pass (JWT Token — a digital key that proves who you are)
- Managing personal profile details
- Escorting people out (Logout — clearing the digital pass)

**Security feature:** After login, the system issues an invisible "token" — like a wristband at an event. Every time the user navigates to a protected page, the system checks for this wristband. If valid, access is granted. If missing, they're redirected to login.

---

## Module 2 — Product Management 🧥
**Department:** Inventory & Display

This module manages the entire product catalogue:
- Displaying all items to shoppers (anyone can see this)
- Allowing admins to add new pieces to the collection
- Letting admins update prices, descriptions, or availability
- Removing discontinued items

Two levels of access: **Public** (anyone can view) and **Admin** (only administrators can make changes).

---

## Module 3 — Shopping Cart 🛒
**Department:** Personal Shopping Assistant

This module keeps track of what a customer has selected:
- Adding a product to the bag
- Adjusting how many of each item
- Removing unwanted pieces
- Calculating the running total automatically

The cart works for both guests (stored in the browser) and logged-in users (stored in the database for persistence across devices).

---

## Module 4 — Order Processing 📋
**Department:** Checkout & Fulfilment

When a customer is ready to buy, this module takes over:
- Receiving the final list of items and quantities
- Recording the delivery address
- Calculating the final price including tax and shipping
- Saving the complete order as a permanent record
- Allowing the customer to view order history

---

## Module 5 — Administrative Module 🔧
**Department:** Store Management

Only the administrator has access to this special dashboard:
- Viewing a bird's-eye view of all products
- Adding brand-new products to the catalogue
- Updating product details like price or availability
- Deleting items that are no longer sold
- (Future: Managing all users and monitoring all orders)

Access is protected by a **Role-Based Access Control** system — meaning the website automatically checks if the logged-in person is an admin. If not, they are denied entry.

---

## Module 6 — Database Management 🗄️
**Department:** Records & Archives

This is the silent module that keeps everything organised:
- A dedicated, reliable connection to the MongoDB database is established every time the server starts
- All data is stored in structured "schemas" (the filing cabinets described in Page 4)
- Data is validated before saving (e.g., a product cannot be created without a name or price)
- If a query fails, the error is caught safely and reported

---

## Module 7 — API & Backend Control 🌐
**Department:** Communications Hub

This is the switchboard that routes every request to the right department:
- When the catalog page asks for products → routes to Product Module
- When someone tries to log in → routes to User Module
- When a purchase is made → routes to Order Module
- All routes are protected where necessary using authentication middleware
- Errors are handled gracefully — the user always sees a helpful message instead of a crash

---

---

# Page 6 — How It All Connects & Summary

## The Journey of a Shopper (End-to-End)

Here is the complete story of one customer's experience — and what happens behind the scenes at every step.

---

```
Customer visits fashionhub.com
         │
         ▼
  HOME PAGE loads
  → Background: Server sends the page file
  → Browser fetches products from /api/products
  → Database returns trending items
  → Trending grid renders on screen
         │
         ▼
  Customer clicks CATALOG
  → All products loaded from database
  → Customer sees full grid
         │
         ▼
  Customer clicks a PRODUCT CARD
  → Navigates to /product?id=...
  → Server fetches that specific product from database
  → Page shows image, description, size options
         │
         ▼
  Customer chooses size M, qty 2
  → Clicks "Add to Bag"
  → Cart stores 2x of the item in local memory
  → Counter in nav bar updates: shows "2"
         │
         ▼
  Customer clicks CART ICON
  → Cart page lists both items
  → Live calculation: Subtotal + 8% Tax + $15 Shipping = Total
         │
         ▼
  Customer clicks PLACE ORDER
  → Not logged in → redirected to /login
  → Customer creates account → password encrypted → saved to database
  → Redirected back to cart → clicks Place Order again
  → Order saved permanently in database
  → Customer can view it under "My Account → Orders"
```

---

## Project Statistics At a Glance

| Category | Detail |
|---|---|
| **Total Pages Built** | 6 (Home, Catalog, Product, Cart, Login, Account) |
| **Backend Modules** | 7 separate functional modules |
| **Database Collections** | 4 (Users, Products, Cart, Orders) |
| **API Endpoints** | 11 RESTful API routes |
| **Security Features** | Password hashing (bcrypt), JWT tokens, Role-Based Access Control |
| **Hosting-Ready** | MongoDB Atlas (cloud database), Node.js backend |
| **Codebase Size** | 27 files committed to GitHub |

---

## Key Technical Concepts — Plain English Glossary

| Term | Simple Explanation |
|---|---|
| **Frontend** | The part of the website you can see and click |
| **Backend** | The invisible engine that processes requests and talks to the database |
| **Database** | A digital filing cabinet that stores all data permanently |
| **API** | A menu of requests the frontend can make to the backend |
| **MongoDB** | The specific database software used — flexible and modern |
| **JWT Token** | A digital wristband that proves you're logged in |
| **Password Hashing** | Scrambling a password so not even developers can read it |
| **Schema** | A template defining what information must be stored (like a form) |
| **RBAC** | Role-Based Access Control — only admins can do admin things |
| **localhost:3000** | The address where the website runs on your own computer |

---

## What Makes This Project Special

✅ **Fully Functional** — every button, link, and form actually works  
✅ **Live Data** — all products are served from a real cloud database  
✅ **Secure** — passwords are encrypted, sessions use modern token technology  
✅ **Modular** — each feature is independently organised for easy maintenance  
✅ **Premium Design** — luxury aesthetic with smooth animations  
✅ **GitHub Hosted** — the complete code is version-controlled and shareable  

---
**Local Address:** `http://localhost:3000`  
