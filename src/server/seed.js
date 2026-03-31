const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'The Heritage Trench',
    price: 1250,
    description: 'A timeless silhouette crafted from water-repellent gabardine. Features a high-stance collar, storm flap, and a belted waist for a sharp, tailored look.',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072&auto=format&fit=crop',
    stock: 12,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'Navy'],
    trending: true,
    rating: 4.8,
    numReviews: 12,
    reviews: [
      {
        name: 'Julian V.',
        rating: 5,
        comment: 'The quality is unmatched. The drape of the gabardine is perfect.',
        user: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    name: 'Cashmere Rolleneck',
    price: 450,
    description: 'Ultra-soft Mongolian cashmere in a relaxed fit. Perfect for layering during the cooler months.',
    category: 'Ready-to-Wear',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop',
    stock: 25,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Charcoal', 'Oatmeal', 'Navy'],
    trending: false,
    rating: 4.5,
    numReviews: 8,
    reviews: []
  },
  {
    name: 'Silk Evening Slip',
    price: 850,
    description: 'Bias-cut heavy silk satin that glides over the body. Features adjustable spaghetti straps and a deep V-neckline.',
    category: 'Ready-to-Wear',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop',
    stock: 8,
    sizes: ['XS', 'S', 'M'],
    colors: ['Midnight', 'Emerald', 'Champagne'],
    trending: true,
    rating: 5.0,
    numReviews: 5,
    reviews: []
  },
  {
    name: 'Chelsea Lug Boots',
    price: 680,
    description: 'Hand-burnished Italian leather with a chunky rubber lug sole. Durable yet sophisticated.',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1935&auto=format&fit=crop',
    stock: 0,
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Black', 'Oxblood'],
    trending: true,
    rating: 4.7,
    numReviews: 18,
    reviews: []
  },
  {
    name: 'Sculptural Hoop Earrings',
    price: 320,
    description: '18k gold-plated brass hoops with a unique organic texture. Lightweight for all-day wear.',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1974&auto=format&fit=crop',
    stock: 40,
    sizes: ['One Size'],
    colors: ['Gold', 'Silver'],
    trending: false,
    rating: 4.9,
    numReviews: 32,
    reviews: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(products);
    console.log('Inserted demo products successfully!');

    const PromoCode = require('./models/PromoCode');
    await PromoCode.deleteMany({});
    await PromoCode.insertMany([
      { code: 'FASHION20', discountPercent: 20, isActive: true, expiryDate: new Date('2026-12-31') },
      { code: 'WELCOME10', discountPercent: 10, isActive: true, expiryDate: new Date('2026-12-31') }
    ]);
    console.log('Inserted demo promo codes successfully!');

    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
