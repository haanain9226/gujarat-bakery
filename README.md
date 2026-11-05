# 🍰 Gujarat Bakery

A modern and responsive bakery website for **Gujarat Bakery**, located in Tarapur, Anand, Gujarat, India.

Customers can explore bakery products, view prices, add items to their basket, and place orders directly through WhatsApp.

## 🌟 Features

- **Product Catalogue** – Browse bakery products by category.
- **Product Categories** – Birthday Cakes, Photo Cakes, Pastries, Bread, Biscuits, Toast, Khari, Puffs and Patties.
- **Shopping Basket** – Add products, update quantities and remove items.
- **WhatsApp Ordering** – Send order details directly to the bakery through WhatsApp.
- **Admin Login** – Secure admin authentication using Supabase.
- **Product Management** – Add, edit and delete products.
- **Image Upload** – Upload product images to Supabase Storage.
- **Automatic Image Cleanup** – Delete the associated Storage image when a product is deleted.
- **Responsive Design** – Designed for desktop and mobile devices.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Supabase Database
- Supabase Authentication
- Supabase Storage
- WhatsApp Ordering Integration

## 📂 Project Structure

```text
gujarat-bakery/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
└── js/
    └── app.js
```

## 🚀 Run Locally

1. Clone the repository:

```bash
git clone https://github.com/haanain9226/gujarat-bakery.git
```

2. Open the project folder:

```bash
cd gujarat-bakery
```

3. Start a local development server using Python:

```bash
py -m http.server 8000
```

4. Open your browser:

```text
http://localhost:8000
```

## 🗄️ Backend

This website uses Supabase for:

- Product database management.
- Admin authentication.
- Product image storage.

A properly configured Supabase project is required for the full functionality of the website.

## 🛒 Ordering

Customers can select products, add them to their basket, enter order details and send their order through WhatsApp.

Online payment integration is not currently included.

## 📍 Bakery Information

**Gujarat Bakery**

Tarapur, Anand, Gujarat, India.

## 🔒 Security

- Admin access is restricted to the authorized account.
- Database access is protected using Row Level Security (RLS).
- Product image upload and deletion are restricted to the authorized admin.
- Never publish Supabase secret or service-role keys, admin passwords, or other private credentials.

## 📄 License

All rights reserved. Contact the project owner for permission before reusing or distributing this project's code and assets.
