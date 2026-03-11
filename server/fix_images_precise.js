const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('./models/Food');

dotenv.config({ path: path.join(__dirname, '.env') });

const manualFixes = [
    { name: /Masala Dosa/i, image: "https://images.unsplash.com/photo-1668236543090-52ee911511f4?w=800" },
    { name: /Veg Fried Rice/i, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800" },
    { name: /Special Biryani/i, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800" },
    { name: /Vegetable Biryani/i, image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800" },
    { name: /Palak Paneer/i, image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=800" },
    { name: /Baingan Bharta/i, image: "https://images.unsplash.com/photo-1596797038530-2c39fa20b6c2?w=800" },
    { name: /Samosa/i, image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=800" },
    { name: /Paneer Tikka Masala/i, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800" },
    { name: /Butter Chicken/i, image: "https://images.unsplash.com/photo-1603894584373-5ac12903ffaf?w=800" },
    { name: /Chicken Biryani/i, image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800" },
    { name: /Watermelon Juice/i, image: "https://images.unsplash.com/photo-1589733901241-5e36427bb1e3?w=800" },
    { name: /Pani Puri/i, image: "https://images.unsplash.com/photo-1589647363585-702c46f63417?w=800" }
];

async function runPreciseFix() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for precise fix...");

        for (const fix of manualFixes) {
            const result = await Food.updateMany(
                { name: fix.name },
                { $set: { image: fix.image } }
            );
            console.log(`Updated ${result.modifiedCount} items matching "${fix.name}"`);
        }

    } catch (err) {
        console.error("Precise fix error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

runPreciseFix();
