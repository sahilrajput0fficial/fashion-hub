const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
    // MEN'S OUTERWEAR
    {
        name: 'Heritage Wool Overcoat',
        price: 45000,
        description: 'A timeless double-breasted overcoat crafted from premium Italian wool. Perfect for formal winter layering.',
        image: '/images/products/mens_winter_coat.png',
        category: 'Outerwear',
        gender: 'Men',
        season: 'Winter',
        brand: 'Heritage',
        material: 'Wool',
        fit: 'Tailored',
        occasion: 'Formal',
        style: 'Classic',
        sustainability: ['Ethical Source'],
        stock: 15,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Charcoal', 'Black'],
        rating: 4.8,
        numReviews: 12,
        trending: true
    },
    {
        name: 'Tech-Shell Performance Parka',
        price: 32000,
        description: 'Water-resistant technical parka featuring heat-sealed seams and multiple utility pockets.',
        image: '/images/products/mens_athleisure_tech_jacket.png',
        category: 'Outerwear',
        gender: 'Men',
        season: 'Winter',
        brand: 'Zenith',
        material: 'Technical',
        fit: 'Regular Fit',
        occasion: 'Casual',
        style: 'Modern',
        sustainability: ['Recycled'],
        stock: 20,
        sizes: ['M', 'L', 'XL'],
        colors: ['Black', 'Olive'],
        rating: 4.5,
        numReviews: 8
    },
    // WOMEN'S OUTERWEAR
    {
        name: 'Alpine Cashmere Blend Coat',
        price: 58000,
        description: 'Luxurious longline coat made from a soft cashmere-wool blend with a waist-defining belt.',
        image: '/images/products/womens_winter_coat.png',
        category: 'Outerwear',
        gender: 'Women',
        season: 'Winter',
        brand: 'Atelier X',
        material: 'Cashmere',
        fit: 'Tailored',
        occasion: 'Formal',
        style: 'Minimalist',
        sustainability: ['Hand-crafted'],
        stock: 10,
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Beige', 'Camel'],
        rating: 4.9,
        numReviews: 15,
        trending: true
    },
    // MEN'S READY-TO-WEAR
    {
        name: 'Riviera Linen Shirt',
        price: 8500,
        description: 'Breathable, lightweight linen shirt designed for summer evenings and coastal escapes.',
        image: '/images/products/mens_summer_linen.png',
        category: 'Ready-to-Wear',
        gender: 'Men',
        season: 'Summer',
        brand: 'Minimalist',
        material: 'Linen',
        fit: 'Relaxed Fit',
        occasion: 'Casual',
        style: 'Modern',
        sustainability: ['Organic'],
        stock: 50,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Sky Blue', 'Cream'],
        rating: 4.7,
        numReviews: 24
    },
    // WOMEN'S READY-TO-WEAR
    {
        name: 'Silk Slip Dress',
        price: 18000,
        description: 'Fluid silk satin slip dress with adjustable straps. A versatile piece for day-to-night styling.',
        image: '/images/products/womens_summer_silk_dress.png',
        category: 'Ready-to-Wear',
        gender: 'Women',
        season: 'Summer',
        brand: 'Minimalist',
        material: 'Silk',
        fit: 'Slim Fit',
        occasion: 'Evening',
        style: 'Minimalist',
        sustainability: ['Organic'],
        stock: 25,
        sizes: ['XS', 'S', 'M'],
        colors: ['Black', 'Emerald', 'Champagne'],
        rating: 4.6,
        numReviews: 18,
        trending: true
    },
    // EVENINGWEAR
    {
        name: 'Emerald Gala Gown',
        price: 120000,
        description: 'Breathtaking silk evening gown with a dramatic floor-length silhouette. Hand-finished detailing.',
        image: '/images/products/womens_evening_silk_gown.png',
        category: 'Eveningwear',
        gender: 'Women',
        season: 'All-Season',
        brand: 'Atelier X',
        material: 'Silk',
        fit: 'Tailored',
        occasion: 'Evening',
        style: 'Modern',
        sustainability: ['Hand-crafted'],
        stock: 5,
        sizes: ['S', 'M'],
        colors: ['Emerald'],
        rating: 5.0,
        numReviews: 4,
        isSale: true,
        discountPercent: 15
    },
    // FOOTWEAR
    {
        name: 'Artisan Oxford Shoes',
        price: 24000,
        description: 'Classic Oxford shoes handcrafted from premium full-grain leather. A staple for the modern professional.',
        image: '/images/products/mens_formal_leather_shoes.png',
        category: 'Footwear',
        gender: 'Men',
        season: 'All-Season',
        brand: 'Heritage',
        material: 'Leather',
        fit: 'Regular Fit',
        occasion: 'Formal',
        style: 'Classic',
        sustainability: ['Ethical Source'],
        stock: 30,
        sizes: ['40', '41', '42', '43', '44'],
        colors: ['Dark Brown', 'Black'],
        rating: 4.8,
        numReviews: 32,
        trending: true
    },
    // KNITWEAR
    {
        name: 'Soft Cashmere Lounge Set',
        price: 65000,
        description: 'The ultimate in luxury comfort. A matching cashmere knit top and trousers set.',
        image: '/images/products/womens_knitwear_set.png',
        category: 'Knitwear',
        gender: 'Women',
        season: 'Winter',
        brand: 'Atelier X',
        material: 'Cashmere',
        fit: 'Oversized',
        occasion: 'Lounge',
        style: 'Minimalist',
        sustainability: ['Hand-crafted', 'Ethical Source'],
        stock: 8,
        sizes: ['S', 'M', 'L'],
        colors: ['Oatmeal', 'Grey'],
        rating: 4.9,
        numReviews: 7
    },
    // ATHLEISURE
    {
        name: 'Urban Tech Joggers',
        price: 12000,
        description: 'High-stretch technical joggers with tapered fit and water-repellent finish.',
        image: '/images/products/mens_athleisure_tech_jacket.png',
        category: 'Athleisure',
        gender: 'Men',
        season: 'All-Season',
        brand: 'Zenith',
        material: 'Technical',
        fit: 'Slim Fit',
        occasion: 'Active',
        style: 'Modern',
        sustainability: ['Recycled'],
        stock: 45,
        sizes: ['M', 'L', 'XL'],
        colors: ['Charcoal', 'Navy'],
        rating: 4.4,
        numReviews: 14
    },
    // ACCESSORIES
    {
        name: 'Minimalist Leather Tote',
        price: 35000,
        description: 'Spacious, unlined leather tote with a clean architectural design. Ideal for daily essentials.',
        image: '/images/products/womens_summer_silk_dress.png', // Placeholder image from pool
        category: 'Accessories',
        gender: 'Women',
        season: 'All-Season',
        brand: 'Fashion Hub',
        material: 'Leather',
        fit: 'Regular Fit',
        occasion: 'Casual',
        style: 'Minimalist',
        sustainability: ['Vegan'],
        stock: 12,
        sizes: ['One Size'],
        colors: ['Tan', 'Black'],
        rating: 4.7,
        numReviews: 21
    },
    // ADDITIONAL ITEMS FOR VARIETY
    {
        name: 'Classic White Tee',
        price: 2500,
        description: 'Made from 100% organic heavy cotton for a premium structure and feel.',
        image: '/images/products/mens_summer_linen.png',
        category: 'Ready-to-Wear',
        gender: 'Unisex',
        season: 'All-Season',
        brand: 'Fashion Hub',
        material: 'Cotton',
        fit: 'Regular Fit',
        occasion: 'Casual',
        style: 'Modern',
        sustainability: ['Organic'],
        stock: 100,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['White'],
        rating: 4.5,
        numReviews: 54
    },
    {
        name: 'Tailored Business Suit',
        price: 85000,
        description: 'Slim-fitting charcoal suit in lightweight wool. Precision tailoring for a sharp silhouette.',
        image: '/images/products/mens_formal_leather_shoes.png', 
        category: 'Ready-to-Wear',
        gender: 'Men',
        season: 'All-Season',
        brand: 'Heritage',
        material: 'Wool',
        fit: 'Slim Fit',
        occasion: 'Business',
        style: 'Classic',
        sustainability: ['Ethical Source'],
        stock: 12,
        sizes: ['48', '50', '52', '54'],
        colors: ['Charcoal'],
        rating: 4.9,
        numReviews: 11
    },
    {
        name: 'Eco-Knit Sneakers',
        price: 15000,
        description: 'Breathable upper made from recycled ocean plastic. Lightweight sole for all-day comfort.',
        image: '/images/products/mens_athleisure_tech_jacket.png',
        category: 'Footwear',
        gender: 'Unisex',
        season: 'Summer',
        brand: 'Zenith',
        material: 'Technical',
        fit: 'Regular Fit',
        occasion: 'Active',
        style: 'Modern',
        sustainability: ['Recycled', 'Vegan'],
        stock: 40,
        sizes: ['38', '39', '40', '41', '42', '43', '44'],
        colors: ['Light Grey', 'Deep Sea'],
        rating: 4.6,
        numReviews: 28
    },
    {
        name: 'Pure Silk Scarf',
        price: 9500,
        description: 'Exquisitely soft silk scarf featuring hand-rolled edges and a custom heritage print.',
        image: '/images/products/womens_summer_silk_dress.png',
        category: 'Accessories',
        gender: 'Women',
        season: 'All-Season',
        brand: 'Atelier X',
        material: 'Silk',
        fit: 'Regular Fit',
        occasion: 'Evening',
        style: 'Classic',
        sustainability: ['Hand-crafted'],
        stock: 15,
        sizes: ['One Size'],
        colors: ['Ruby', 'Gold'],
        rating: 4.8,
        numReviews: 9
    },
    {
        name: 'Oversized Cashmere Hoodie',
        price: 42000,
        description: 'Ultra-soft cashmere hoodie with a relaxed, modern silhouette. The peak of off-duty luxury.',
        image: '/images/products/womens_knitwear_set.png',
        category: 'Knitwear',
        gender: 'Unisex',
        season: 'Winter',
        brand: 'Urban Luxe',
        material: 'Cashmere',
        fit: 'Oversized',
        occasion: 'Lounge',
        style: 'Minimalist',
        sustainability: ['Ethical Source'],
        stock: 18,
        sizes: ['S', 'M', 'L'],
        colors: ['Black', 'Navy'],
        rating: 4.9,
        numReviews: 16
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        console.log('Old products cleared.');
        
        await Product.insertMany(products);
        console.log('Database seeded with 15+ premium products across all categories.');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
