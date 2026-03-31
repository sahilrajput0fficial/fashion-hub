const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const products = [
    // Outerwear
    {
        name: 'Structured Wool Overcoat',
        price: 85000,
        description: 'An architectural wool coat with sharp tailoring and minimalist silhouette. Features hidden buttons and Italian wool blend.',
        image: 'https://images.unsplash.com/photo-1544022613-e87ce71c85bc?auto=format&fit=crop&q=80&w=800',
        category: 'Outerwear',
        stock: 15,
        rating: 4.9,
        numReviews: 12,
        trending: true,
        sizes: ['XS', 'S', 'M', 'L', 'XL']
    },
    {
        name: 'Heritage Leather Moto',
        price: 65000,
        description: 'Buttery soft pebbled leather jacket with silver-toned hardware. A timeless staple that ages beautifully with wear.',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        category: 'Outerwear',
        stock: 8,
        rating: 4.8,
        numReviews: 24,
        trending: false,
        sizes: ['S', 'M', 'L']
    },
    {
        name: 'Atelier Belted Trench',
        price: 45000,
        description: 'Water-resistant gabardine trench coat in a classic sand hue. Features a structured collar and waist-defining belt.',
        image: 'https://images.unsplash.com/photo-1475180098004-3894062274cb?auto=format&fit=crop&q=80&w=800',
        category: 'Outerwear',
        stock: 20,
        rating: 4.7,
        numReviews: 18,
        trending: false,
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        name: 'Modern Utility Parka',
        price: 32000,
        description: 'Versatile parka with multiple pockets and adjustable hood. Crafted from durable cotton-twill for everyday resilience.',
        image: 'https://images.unsplash.com/photo-1539106604-2460d195f24f?auto=format&fit=crop&q=80&w=800',
        category: 'Outerwear',
        stock: 25,
        rating: 4.6,
        numReviews: 15,
        trending: true,
        sizes: ['M', 'L', 'XL']
    },

    // Ready-To-Wear
    {
        name: 'Liquid Silk Blouse',
        price: 18500,
        description: 'Elegant silk blouse with a soft sheen and relaxed drape. Perfect for transitioning from office to evening events.',
        image: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=800',
        category: 'Ready-to-Wear',
        stock: 12,
        rating: 4.9,
        numReviews: 31,
        trending: true,
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        name: 'Denim Indigo Jacket',
        price: 12500,
        description: 'Raw indigo denim jacket with contrast stitching. Designed for a slightly oversized fit and timeless appeal.',
        image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800',
        category: 'Ready-to-Wear',
        stock: 30,
        rating: 4.7,
        numReviews: 42,
        trending: false,
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        name: 'Pleated Linen Midi',
        price: 22000,
        description: 'High-waisted midi skirt with structured pleats. Breathable linen blend ideal for warm-weather sophisticated styling.',
        image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800',
        category: 'Ready-to-Wear',
        stock: 18,
        rating: 4.8,
        numReviews: 19,
        trending: false,
        sizes: ['S', 'M', 'L']
    },
    {
        name: 'Asymmetric Floral Maxi',
        price: 45000,
        description: 'Ethereal maxi dress with a bespoke floral print. Features an asymmetric hem and delicate silk chiffon layering.',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
        category: 'Ready-to-Wear',
        stock: 5,
        rating: 5.0,
        numReviews: 7,
        trending: true,
        sizes: ['XS', 'S', 'M']
    },

    // Knitwear
    {
        name: 'Cashmere Ribbed Cardigan',
        price: 28500,
        description: 'Ultra-soft cashmere cardigan with chunky rib detailing. An essential layering piece in a neutral stone palette.',
        image: 'https://images.unsplash.com/photo-1576188973526-0e5d142247dc?auto=format&fit=crop&q=80&w=800',
        category: 'Knitwear',
        stock: 14,
        rating: 4.9,
        numReviews: 28,
        trending: true,
        sizes: ['S', 'M', 'L']
    },
    {
        name: 'Oversized Cable Knit',
        price: 16500,
        description: 'Cozy wool-blend sweater with intricate cable patterns. Designed for a bold, chunky silhouette and ultimate comfort.',
        image: 'https://images.unsplash.com/photo-1556905544-c5e81f6a7f33?auto=format&fit=crop&q=80&w=800',
        category: 'Knitwear',
        stock: 22,
        rating: 4.7,
        numReviews: 35,
        trending: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL']
    },

    // Footwear
    {
        name: 'Atelier Leather Pump',
        price: 42000,
        description: 'Pointed-toe leather pumps with a sculptural heel. Crafted by hand in Italy for unmatched comfort and style.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        category: 'Footwear',
        stock: 10,
        rating: 4.8,
        numReviews: 22,
        trending: true,
        sizes: ['36', '37', '38', '39', '40']
    },
    {
        name: 'Minimalist Strap Sandal',
        price: 28000,
        description: 'Sleek leather sandals with fine straps and a square toe. Effortless elegance for summer evenings.',
        image: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=800',
        category: 'Footwear',
        stock: 16,
        rating: 4.6,
        numReviews: 14,
        trending: false,
        sizes: ['37', '38', '39', '40']
    },
    {
        name: 'Premium Leather Sneaker',
        price: 18500,
        description: 'Clean, minimalist sneakers in premium white leather. Features a reinforced sole and moisture-wicking lining.',
        image: 'https://images.unsplash.com/photo-1512374382149-4332c6c75d41?auto=format&fit=crop&q=80&w=800',
        category: 'Footwear',
        stock: 40,
        rating: 4.8,
        numReviews: 53,
        trending: false,
        sizes: ['38', '39', '40', '41', '42']
    },
    {
        name: 'Suede Ankle Boot',
        price: 32000,
        description: 'Luxe suede boots with a Western-inspired silhouette. Finished with a stacked wooden heel and side zipper.',
        image: 'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&q=80&w=800',
        category: 'Footwear',
        stock: 14,
        rating: 4.7,
        numReviews: 11,
        trending: true,
        sizes: ['37', '38', '39', '40']
    },

    // Eveningwear
    {
        name: 'Velvet Evening Gown',
        price: 145000,
        description: 'Floor-length gown in deep midnight velvet. Features a dramatic side slit and elegant cowl neckline.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c40e2a6?auto=format&fit=crop&q=80&w=800',
        category: 'Eveningwear',
        stock: 4,
        rating: 5.0,
        numReviews: 5,
        trending: true,
        sizes: ['XS', 'S', 'M']
    },
    {
        name: 'Silk Slip Dress',
        price: 48000,
        description: 'Minimalist 90s-inspired slip dress in bias-cut heavy silk. Effortlessly chic for black-tie or cocktail events.',
        image: 'https://images.unsplash.com/photo-1539008885618-19eb2057d363?auto=format&fit=crop&q=80&w=800',
        category: 'Eveningwear',
        stock: 12,
        rating: 4.9,
        numReviews: 18,
        trending: false,
        sizes: ['S', 'M', 'L']
    },

    // Accessories
    {
        name: 'Heritage Automatic Watch',
        price: 125000,
        description: 'Exquisite timepiece with a sapphire crystal face and automatic movement. Hand-assembled with a leather strap.',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
        category: 'Accessories',
        stock: 6,
        rating: 4.9,
        numReviews: 9,
        trending: true,
        sizes: ['OS']
    },
    {
        name: 'Structured Leather Carryall',
        price: 75000,
        description: 'Hand-crafted leather bag with architectural lines and spacious interior. Includes a detachable shoulder strap.',
        image: 'https://images.unsplash.com/photo-1521335629791-ce4967d95863?auto=format&fit=crop&q=80&w=800',
        category: 'Accessories',
        stock: 8,
        rating: 4.8,
        numReviews: 14,
        trending: false,
        sizes: ['OS']
    },
    {
        name: 'Sculptural Gold Cuff',
        price: 24500,
        description: 'Bold, minimalist cuff in recycled 18k gold-plated brass. A statement piece designed for the modern woman.',
        image: 'https://images.unsplash.com/photo-1509319213191-381c034731a5?auto=format&fit=crop&q=80&w=800',
        category: 'Accessories',
        stock: 15,
        rating: 4.7,
        numReviews: 21,
        trending: false,
        sizes: ['OS']
    },
    {
        name: 'Pure Silk Scarf',
        price: 14500,
        description: 'Square silk scarf with a hand-painted geometric print. Adds a touch of luxury to any ensemble.',
        image: 'https://images.unsplash.com/photo-1601924995957-324c1b117e96?auto=format&fit=crop&q=80&w=800',
        category: 'Accessories',
        stock: 20,
        rating: 4.6,
        numReviews: 12,
        trending: false,
        sizes: ['OS']
    }
];

const seedData = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
