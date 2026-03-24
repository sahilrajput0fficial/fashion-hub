const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = [
    {
        name: 'Structured Wool Overcoat',
        price: 1250,
        category: 'Outerwear',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeLWO2WTqipyxNvF97CukutVsaQxXyatEMNFfeQilMrjlAFGCXKi-3tlTl2p-hq7iFC7WLUCQROyTdJtp4aFLRwLyeFdsIoD557GaRL0j6PBLuKGzufKWEIi-Ka_nRu4u4wk297gD7rjXovejw3Ob8-Wh4RJrIuytomsbVBLvwiJEDdKrDD6nnysv6QNz6gcxrtjYklyydJuxg4h0weTV4U5EPsaPROJJ1BzSSqQ24ZLvYX7YRPyRjUk-m0kxacRnDO6VTMznHbY0',
        trending: true,
        description: 'A structural masterpiece crafted from premium Italian wool.',
        stock: 10
    },
    {
        name: 'Liquid Silk Blouse',
        price: 420,
        category: 'Ready-to-Wear',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4nJnI9C7Hioc35RDb0GJgymWRBCj_G5SiwOQ3l9PJv3SQ0PN4M9KSXZ6fqlHwvhQNPL8KF9ShNCwp3MTO23Ku7qm9Dd4I2b4iqvwx2kojvmfLK2heS8NvmDnwMaaSDTSjqOThtqfFBVC2aSjMZ9k-K1Opcjm-ycfZtLwXKaCLg2A8JgBkMSCy1ijrwNafS1oUzaQijGzpVfSBFBt2L3gdpvBO5VtJUmnRfHhAXkuK5Ev6N7XpzxS4kadhJ0GVDNG5qIB8IkC5pvE',
        trending: true,
        description: 'Effortless elegance in every drape.',
        stock: 15
    },
    {
        name: 'Atelier Leather Pump',
        price: 680,
        category: 'Footwear',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiYrnkTF6Kig-VhJnwEoslIb-7lQ_EegWgT6A-Vt31nUgAo0XJDEARZwDKXnlvQKTWoZhqe4orrhuIKOobC36miBptWL5twuEOZH6LdeYKHv4AWJEXiKw_caUVV6FSukaDUj6gEKlB-ro5czfUk4Wkz7MVyc9L-X6POS5cJSkyI6cjsYu-SazAHddLy_DdmjAjd4w0KaYT8hcBDnQkOFuiJXxh4IeWdeyBJ45iqx_oB0FDGP_8djlB8g7CAo4Bwo7E3ycQJRpcIvE',
        trending: true,
        description: 'Architectural precision meets handcrafted luxury.',
        stock: 8
    },
    {
        name: 'Tailored Linen Trousers',
        price: 350,
        category: 'Ready-to-Wear',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO4eOmXUA5JMlXnz4YYnPeRo1ZJDu1QVKeR5bsPJFLTalKFacCbnQd4aLyCPS1r9lLj3Zl2z0YK3rDWgH77A-1BHyDjyj2j4GgAidZtcpdd0FmhEASXE6Udk9r-XkL3-gvWqfGk6bPnPpOTr5NRK5RvqRsitgsiqDPRLRXpc-te5CChhfLR1zP831uFRE7qGZEqeiqyBfuoA6TydbZYhkuX37KvJ2Hx4Hb-ptoTOkiMwVlZZS2prz1rlCVCc3F-7QMeN7UUIBD1nA',
        trending: false,
        description: 'Relaxed yet refined, perfect for modern versatility.',
        stock: 12
    }
];
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
