const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost:27017/shoe-store')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });
  
    console.log('Admin user created:', adminUser.email);

    // Create sample products
    const products = [
      {
        name: 'Classic Leather Sneakers',
        description: 'Timeless leather sneakers perfect for casual wear. Features premium leather upper and comfortable cushioning.',
        price: 79.99,
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        ],
        brand: 'ClassicWear',
        category: 'casual',
        sizes: [
          { size: 8, stock: 10 },
          { size: 9, stock: 15 },
          { size: 10, stock: 12 }
        ],
        color: 'Brown',
        featured: true
      },
      {
        name: 'Professional Oxford Shoes',
        description: 'Elegant oxford shoes for formal occasions. Made with genuine leather and featuring a classic design.',
        price: 129.99,
        images: [
          'https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1582897085656-c636d006a246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        ],
        brand: 'FormalFit',
        category: 'formal',
        sizes: [
          { size: 8, stock: 8 },
          { size: 9, stock: 10 },
          { size: 10, stock: 8 }
        ],
        color: 'Black',
        featured: true
      },
      {
        name: 'Performance Running Shoes',
        description: 'Lightweight and breathable running shoes with advanced cushioning technology.',
        price: 99.99,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        ],
        brand: 'SportMax',
        category: 'sports',
        sizes: [
          { size: 8, stock: 12 },
          { size: 9, stock: 18 },
          { size: 10, stock: 15 }
        ],
        color: 'Blue/White',
        featured: true
      },
      {
        name: 'Waterproof Hiking Boots',
        description: 'Durable hiking boots with waterproof membrane and excellent traction.',
        price: 149.99,
        images: [
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        ],
        brand: 'TrailMaster',
        category: 'boots',
        sizes: [
          { size: 8, stock: 6 },
          { size: 9, stock: 8 },
          { size: 10, stock: 7 }
        ],
        color: 'Brown/Black',
        featured: false
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('Data seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 