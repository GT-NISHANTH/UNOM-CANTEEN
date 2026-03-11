const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('./models/Food');

dotenv.config({ path: path.join(__dirname, '.env') });

const menuItems = [
    // --- VEG (20 ITEMS) ---
    { name: "Paneer Tikka Masala", price: 180, category: "veg", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500", description: "Grilled paneer in spicy tomato gravy." },
    { name: "Dal Makhani", price: 150, category: "veg", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500", description: "Creamy black lentils slow-cooked overnight." },
    { name: "Vegetable Biryani", price: 160, category: "veg", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500", description: "Aromatic basmati rice with mixed vegetables." },
    { name: "Aloo Gobi", price: 120, category: "veg", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500", description: "Classic potato and cauliflower dry curry." },
    { name: "Palak Paneer", price: 170, category: "veg", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Paneer cubes in a smooth spinach puree." },
    { name: "Chana Masala", price: 130, category: "veg", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500", description: "Spiced chickpeas in a tangy gravy." },
    { name: "Baingan Bharta", price: 140, category: "veg", image: "https://images.unsplash.com/photo-1596797038530-2c39fa20b6c2?w=500", description: "Smoky mashed eggplant with spices." },
    { name: "Mix Veg Curry", price: 140, category: "veg", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", description: "Fresh seasonal vegetables in a rich gravy." },
    { name: "Malai Kofta", price: 190, category: "veg", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500", description: "Veggie balls in a creamy cashew sauce." },
    { name: "Bhindi Masala", price: 125, category: "veg", image: "https://images.unsplash.com/photo-1626777553735-483584988448?w=500", description: "Stir-fried okra with onions and tomatoes." },
    { name: "Jeera Aloo", price: 110, category: "veg", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500", description: "Potato sautéed with cumin seeds." },
    { name: "Veg Pulao", price: 130, category: "veg", image: "https://images.unsplash.com/photo-1596797038530-2c39fa20b6c2?w=500", description: "Fragrant rice with peas and carrots." },
    { name: "Kadai Paneer", price: 185, category: "veg", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500", description: "Paneer cooked with bell peppers in a kadai." },
    { name: "Mutter Paneer", price: 175, category: "veg", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Paneer and green peas in a spicy gravy." },
    { name: "Gobi Manchurian", price: 150, category: "veg", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", description: "Crispy cauliflower in Indo-Chinese sauce." },
    { name: "Veg Hakka Noodles", price: 140, category: "veg", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500", description: "Stir-fried noodles with crunchy vegetables." },
    { name: "Veg Fried Rice", price: 135, category: "veg", image: "https://images.unsplash.com/photo-1512058560366-cd242958773c?w=500", description: "Classic Indo-Chinese fried rice." },
    { name: "Dal Tadka", price: 120, category: "veg", image: "https://images.unsplash.com/photo-1546833958-3f89028a05c8?w=500", description: "Yellow lentils with a spicy tempering." },
    { name: "Methi Mutter Malai", price: 180, category: "veg", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500", description: "Fenugreek and peas in a creamy white gravy." },
    { name: "Veg Kofta", price: 155, category: "veg", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500", description: "Deep-fried veg balls in spicy tomato curry." },

    // --- NON-VEG (20 ITEMS) ---
    { name: "Butter Chicken", price: 250, category: "nonveg", image: "https://images.unsplash.com/photo-1603894584373-5ac12903ffaf?w=500", description: "The legendary creamy tomato chicken." },
    { name: "Chicken Tikka", price: 210, category: "nonveg", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500", description: "Grilled marinated chicken chunks." },
    { name: "Chicken Biryani", price: 230, category: "nonveg", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500", description: "King of biryanis with tender chicken." },
    { name: "Mutton Rogan Josh", price: 320, category: "nonveg", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", description: "Kashmiri style mutton in red gravy." },
    { name: "Fish Curry", price: 260, category: "nonveg", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500", description: "Spicy coastal style fish curry." },
    { name: "Chicken Chettinad", price: 240, category: "nonveg", image: "https://images.unsplash.com/photo-1589647363585-702c46f63417?w=500", description: "Extremely spicy South Indian chicken." },
    { name: "Egg Curry", price: 140, category: "nonveg", image: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?w=500", description: "Boiled eggs in a rich spicy gravy." },
    { name: "Tandoori Chicken", price: 280, category: "nonveg", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500", description: "Half chicken grilled in a tandoor." },
    { name: "Mutton Keema", price: 290, category: "nonveg", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", description: "Minced mutton with peas and spices." },
    { name: "Chicken Korma", price: 245, category: "nonveg", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500", description: "Chicken slow-cooked in yogurt and onion." },
    { name: "Kadai Chicken", price: 235, category: "nonveg", image: "https://images.unsplash.com/photo-1626777552126-b302c40c838e?w=500", description: "Chicken with thick spicy bell pepper gravy." },
    { name: "Prawns Masala", price: 350, category: "nonveg", image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=500", description: "Juicy prawns in a fiery masala." },
    { name: "Chicken 65", price: 180, category: "nonveg", image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500", description: "Crispy fried spicy chicken appetizer." },
    { name: "Chicken Manchurian", price: 210, category: "nonveg", image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500", description: "Classic Indo-Chinese chicken dish." },
    { name: "Egg Fried Rice", price: 150, category: "nonveg", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500", description: "Fried rice with scrambled eggs." },
    { name: "Chicken Fried Rice", price: 170, category: "nonveg", image: "https://images.unsplash.com/photo-1623595110708-76b25acc667a?w=500", description: "Fried rice with tender chicken bits." },
    { name: "Mutton Biryani", price: 300, category: "nonveg", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=500", description: "Rich mutton biryani with bone-in chunks." },
    { name: "Chicken Lollipop", price: 190, category: "nonveg", image: "https://images.unsplash.com/photo-1569058242252-623df46b5025?w=500", description: "Frenched chicken wings in spicy batter." },
    { name: "Fish Fry", price: 220, category: "nonveg", image: "https://images.unsplash.com/photo-1621510456681-229ef55417b4?w=500", description: "Crispy masala fried fish slices." },
    { name: "Chicken Roll", price: 120, category: "nonveg", image: "https://images.unsplash.com/photo-1626700051175-6518a4993f57?w=500", description: "Grilled chicken wrapped in a paratha." },

    // --- JUICE (20 ITEMS) ---
    { name: "Fresh Orange Juice", price: 60, category: "juice", image: "https://images.unsplash.com/photo-1613478223719-2ab80261f058?w=500", description: "Freshly squeezed vitamin C boost." },
    { name: "Mango Shake", price: 80, category: "juice", image: "https://images.unsplash.com/photo-1629831969062-8e7e1329c54e?w=500", description: "Creamy seasonal Alphonso mango shake." },
    { name: "Watermelon Juice", price: 50, category: "juice", image: "https://images.unsplash.com/photo-1589733901241-5e36427bb1e3?w=500", description: "Cooling and refreshing summer juice." },
    { name: "Pineapple Juice", price: 70, category: "juice", image: "https://images.unsplash.com/photo-1619672802302-3f19e7e7a83d?w=500", description: "Zesty and sweet tropical juice." },
    { name: "Apple Juice", price: 75, category: "juice", image: "https://images.unsplash.com/photo-1568283096533-0dd8a1481b25?w=500", description: "Pure apple extract with no added sugar." },
    { name: "Mixed Fruit Juice", price: 85, category: "juice", image: "https://images.unsplash.com/photo-1517701550927-30cf4ae1db40?w=500", description: "A blend of 4-5 seasonal fruits." },
    { name: "Lime Soda", price: 40, category: "juice", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500", description: "Sweet and salty refreshing soda." },
    { name: "Banana Smoothie", price: 70, category: "juice", image: "https://images.unsplash.com/photo-1550586671-f71ee15575a4?w=500", description: "Energy-packed smoothie with honey." },
    { name: "Grape Juice", price: 65, category: "juice", image: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=500", description: "Black grape juice with a hint of salt." },
    { name: "Chocolate Milkshake", price: 90, category: "juice", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500", description: "Rich Belgian chocolate blend." },
    { name: "Strawberry Shake", price: 95, category: "juice", image: "https://images.unsplash.com/photo-1570733577524-2a075365e1dc?w=500", description: "Pink delight with real strawberries." },
    { name: "Avocado Shake", price: 120, category: "juice", image: "https://images.unsplash.com/photo-1584806306748-024564347941?w=500", description: "Healthy and buttery smooth shake." },
    { name: "Lassi", price: 55, category: "juice", image: "https://images.unsplash.com/photo-1571153181822-e7f09315510b?w=500", description: "Traditional sweet Punjabi yogurt drink." },
    { name: "Cold Coffee", price: 80, category: "juice", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500", description: "Frothy coffee served chilled." },
    { name: "Pomegranate Juice", price: 110, category: "juice", image: "https://images.unsplash.com/photo-1541334914182-017cd1acc1d0?w=500", description: "Freshly pressed iron-rich juice." },
    { name: "Blueberry Smoothie", price: 130, category: "juice", image: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=500", description: "Antioxidant booster with greek yogurt." },
    { name: "Kiwi Juice", price: 100, category: "juice", image: "https://images.unsplash.com/photo-1589010588553-46e8e7c21788?w=500", description: "Tangy and bright green fresh juice." },
    { name: "Papaya Shake", price: 65, category: "juice", image: "https://images.unsplash.com/photo-1483137140003-ce3014cddd53?w=500", description: "Mildly sweet and great for digestion." },
    { name: "Cold Pressed Carrot", price: 90, category: "juice", image: "https://images.unsplash.com/photo-1622597467836-f3385e440cd2?w=500", description: "Pure carrot extract for health." },
    { name: "Lemon Mint Juice", price: 45, category: "juice", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500", description: "Minty fresh lime juice." },

    // --- SNACKS (20 ITEMS) ---
    { name: "Samosa (2 pcs)", price: 30, category: "snacks", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Crispy potato-filled pastries." },
    { name: "Vada Pav", price: 25, category: "snacks", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500", description: "The iconic Mumbai burger." },
    { name: "French Fries", price: 70, category: "snacks", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", description: "Classic salted crispy fries." },
    { name: "Masala Chai", price: 15, category: "snacks", image: "https://images.unsplash.com/photo-1544787210-2211d4e3860d?w=500", description: "Canteen special ginger tea." },
    { name: "Pani Puri", price: 40, category: "snacks", image: "https://images.unsplash.com/photo-1589647363585-702c46f63417?w=500", description: "Crispy balls with spicy water." },
    { name: "Bhel Puri", price: 35, category: "snacks", image: "https://images.unsplash.com/photo-1513116476489-7634ec1f212d?w=500", description: "Crunchy puffed rice with chutneys." },
    { name: "Dahi Vada", price: 50, category: "snacks", image: "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=500", description: "Lentil fritters in spiced yogurt." },
    { name: "Cheese Sandwich", price: 60, category: "snacks", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500", description: "Grill toasted with molten cheese." },
    { name: "Paneer Pakora", price: 80, category: "snacks", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Paneer fritters in chickpea batter." },
    { name: "Aloo Tikki", price: 45, category: "snacks", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500", description: "Pan-fried potato patties." },
    { name: "Maggi Noodles", price: 40, category: "snacks", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500", description: "Every student's 2-minute snack." },
    { name: "Bread Pakora", price: 30, category: "snacks", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Fried bread stuffed with spicy potato." },
    { name: "Onion Bhaji", price: 40, category: "snacks", image: "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=500", description: "Crispy spiced onion fritters." },
    { name: "Spring Rolls", price: 90, category: "snacks", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", description: "Crispy rolls with veg filling." },
    { name: "Pav Bhaji", price: 85, category: "snacks", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500", description: "Mash veg curry with buttered pav." },
    { name: "Chana Chaat", price: 40, category: "snacks", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500", description: "Spicy and tangy chickpea salad." },
    { name: "Chicken Wings", price: 150, category: "snacks", image: "https://images.unsplash.com/photo-1569058242252-623df46b5025?w=500", description: "Hot and spicy chicken wings." },
    { name: "Loaded Nachos", price: 110, category: "snacks", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500", description: "Nachos with cheese and salsa." },
    { name: "Egg Sandwich", price: 55, category: "snacks", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500", description: "Boiled egg with mayo and pepper." },
    { name: "Corn Chaat", price: 45, category: "snacks", image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=500", description: "Buttery sweet corn with spices." }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for seeding...");

        // Optional: Clear existing menu if requested, or just append
        // await Food.deleteMany({});
        // console.log("Cleared existing menu items.");

        await Food.insertMany(menuItems);
        console.log(`Successfully added ${menuItems.length} items to the menu!`);

    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
