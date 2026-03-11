const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('./models/Food');

dotenv.config({ path: path.join(__dirname, '.env') });

const categoryImages = {
    'veg': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    'nonveg': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800',
    'juice': 'https://images.unsplash.com/photo-1613478223719-2ab80261f058?w=800',
    'snacks': 'https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=800',
    'breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
    'meals': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
    'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
};

async function fixImages() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB...");

        const foods = await Food.find({});
        console.log(`Checking ${foods.length} items...`);

        let updatedCount = 0;

        for (const food of foods) {
            // Check if image is missing, empty, or a placeholder that might be broken
            const isBroken = !food.image || food.image.trim() === "" || food.image.includes("example.com") || food.image.startsWith("/");

            if (isBroken) {
                const category = (food.category || 'default').toLowerCase().replace("-", "");
                const newImage = categoryImages[category] || categoryImages['default'];

                food.image = newImage;
                await food.save();
                console.log(`Fixed image for: ${food.name} (${food.category})`);
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} items with missing images.`);

    } catch (err) {
        console.error("Error fixing images:", err);
    } finally {
        await mongoose.disconnect();
    }
}

fixImages();
