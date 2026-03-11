import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
    Sparkles, Tag, Utensils, Percent, Check, ShoppingCart,
    ChevronRight, Zap, Flame, Crown, Filter, Grid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function Menu() {
    const [foods, setFoods] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [toast, setToast] = useState(null);
    const { addToCart, cart } = useCart();
    const { user } = useAuth();

    const isWednesday = new Date().getDay() === 3;
    const isStudent = user?.role === 'student';

    // Role-based design tokens
    const themeColor = isStudent ? 'red' : 'amber';
    const themeGradient = isStudent ? 'from-red-600 to-orange-500' : 'from-amber-400 to-yellow-600';

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const getWeeklyCode = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const week = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
        return `WEDW${week}`;
    };

    const weeklyCode = getWeeklyCode();

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const res = await API.get("/food");
            setFoods(res.data);
            setFilteredFoods(res.data);
        } catch (err) {
            console.error("Failed to fetch menu:", err);
        }
    };

    const filterCategory = (category) => {
        if (category === "all") {
            setFilteredFoods(foods);
        } else {
            setFilteredFoods(foods.filter(food => food.category === category));
        }
    };

    const getPrice = (price) => {
        if (isWednesday && isStudent) {
            return Math.floor(price * 0.75);
        }
        return price;
    };

    const handleAddToCart = (food, price) => {
        addToCart({ ...food, price });
        setToast(`${food.name} added to cart!`);
    };

    const isInCart = (foodId) => cart.some(item => item.food._id === foodId);

    const getFallbackImage = (category) => {
        const cat = (category || 'default').toLowerCase();
        if (cat.includes('veg')) return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=60";
        if (cat.includes('nonveg')) return "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=60";
        if (cat.includes('juice')) return "https://images.unsplash.com/photo-1613478223719-2ab80261f058?w=800&q=60";
        if (cat.includes('snacks')) return "https://images.unsplash.com/photo-1601050638914-0498877bc3ba?w=800&q=60";
        return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60";
    };

    return (
        <div className="min-h-screen bg-gray-50/30 overflow-hidden">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                        className="fixed bottom-12 left-1/2 z-[2000] bg-gray-900/90 backdrop-blur-xl text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/10"
                    >
                        <div className={`bg-${themeColor}-500 p-2 rounded-full shadow-lg shadow-${themeColor}-500/20`}>
                            <ShoppingCart size={18} className="text-white" />
                        </div>
                        <span className="font-black tracking-tight">{toast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6 py-12 max-w-7xl relative">
                {/* Asymmetric Header */}
                <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`w-3 h-3 rounded-full bg-${themeColor}-500 animate-pulse`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Smart Canteen Live</span>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-none mb-4">
                            Crave <br />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}>Anything.</span>
                        </h1>
                        <p className="text-gray-400 font-bold ml-2 max-w-sm">Artisanal canteen meals, crafted for your daily energy.</p>
                    </motion.div>

                    {/* Spotlight Item (Manual selection or first item) */}
                    {foods.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`bg-white rounded-[3.5rem] p-8 shadow-2xl border border-${themeColor}-50 relative group overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-8 z-10">
                                <span className={`bg-${themeColor}-500 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-${themeColor}-500/20`}>
                                    <Crown size={12} /> Chef's Spotlight
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-48 h-48 rounded-[3rem] overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                                    <img
                                        src={foods[0].image || getFallbackImage(foods[0].category)}
                                        alt="Spotlight"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(foods[0].category); }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-2 truncate max-w-[200px]">{foods[0].name}</h2>
                                    <p className="text-gray-400 text-sm font-bold mb-6 italic">{foods[0].category}</p>
                                    <button
                                        onClick={() => handleAddToCart(foods[0], getPrice(foods[0].price))}
                                        className={`bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs inline-flex items-center gap-2 hover:bg-${themeColor}-500 transition-all`}
                                    >
                                        Try Today <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Role Specific Banners */}
                {isStudent && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gradient-to-r ${themeGradient} rounded-[3rem] p-10 text-white shadow-2xl shadow-${themeColor}-200/50 mb-16 relative overflow-hidden`}
                    >
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="bg-white/20 p-6 rounded-[2rem] backdrop-blur-xl border border-white/10">
                                    <Percent size={40} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter italic">Wednesday Rush!</h3>
                                    <p className="text-white/80 font-bold text-lg">
                                        Students get instant 25% OFF.
                                        {isWednesday ? (
                                            <span className="ml-2 bg-white text-red-600 px-4 py-1 rounded-full text-xs font-black animate-bounce inline-block">CODE: {weeklyCode}</span>
                                        ) : (
                                            <span className="ml-2 text-white/60">Next one's brewing soon...</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-black/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                <Zap className="text-yellow-300" /> Member: {user.name}
                            </div>
                        </div>
                        <Sparkles className="absolute -bottom-4 -right-4 text-white/10 rotate-12" size={200} />
                    </motion.div>
                )}

                {/* Glassmorphic Category Bar */}
                <div className="sticky top-24 z-50 mb-16">
                    <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-3 rounded-[2.5rem] shadow-2xl flex flex-wrap justify-center gap-3 max-w-fit mx-auto ring-1 ring-gray-900/5">
                        {["all", "veg", "nonveg", "juice", "snacks"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    filterCategory(cat)
                                    setActiveCategory(cat)
                                }}
                                className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                                    ${cat === activeCategory
                                        ? `bg-${themeColor}-500 text-white shadow-xl shadow-${themeColor}-500/20`
                                        : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {cat === "nonveg" ? "Non-Veg" : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Logic - Simple staggered columns using CSS grid and group-hover transforms */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredFoods.map((food, idx) => {
                        const originalPrice = food.price;
                        const finalPrice = getPrice(originalPrice);
                        const hasDiscount = originalPrice !== finalPrice;
                        const alreadyInCart = isInCart(food._id);

                        // Staggered height effect based on index
                        const isStaggered = idx % 2 === 1;

                        return (
                            <motion.div
                                key={food._id}
                                layout
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className={`group relative bg-white border border-gray-100 rounded-[3.5rem] p-6 transition-all duration-700 hover:border-${themeColor}-200 
                                    ${isStaggered ? 'md:mt-12' : ''} 
                                    ${alreadyInCart ? 'opacity-80 grayscale-[0.5]' : 'hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4'}`}
                            >
                                {/* In Cart Pulse Aura */}
                                {alreadyInCart && (
                                    <div className={`absolute inset-0 rounded-[3.5rem] ring-4 ring-${themeColor}-500/20 animate-pulse z-0`} />
                                )}

                                <div className="relative z-10">
                                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-gray-200/50">
                                        <img
                                            src={food.image || getFallbackImage(food.category)}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                                            alt={food.name}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Status Tags */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-gray-900 shadow-lg">
                                                {food.category}
                                            </span>
                                        </div>

                                        {hasDiscount && (
                                            <div className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl shadow-xl flex items-center justify-center">
                                                <Flame size={14} className="animate-bounce" />
                                            </div>
                                        )}

                                        {alreadyInCart && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 flex items-center justify-center bg-gray-900/40 backdrop-blur-[2px]"
                                            >
                                                <div className="bg-white p-4 rounded-full shadow-2xl">
                                                    <Check size={24} className={`text-${themeColor}-500 font-black`} />
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 transition-all">
                                        {food.name}
                                    </h3>
                                    <p className="text-gray-400 font-bold text-xs mb-8 line-clamp-2 italic leading-relaxed">
                                        {food.description || "The ultimate fusion of flavor and nutrition, designed for scholars."}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            {hasDiscount && (
                                                <p className="text-[10px] text-gray-300 line-through font-black">₹{originalPrice}</p>
                                            )}
                                            <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{finalPrice}</p>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(food, finalPrice)}
                                            disabled={alreadyInCart}
                                            className={`p-4 rounded-2xl shadow-xl transition-all relative overflow-hidden active:scale-95
                                                ${alreadyInCart
                                                    ? 'bg-gray-100 text-gray-300'
                                                    : `bg-gray-900 text-white hover:bg-${themeColor}-500 shadow-${themeColor}-100`}`}
                                        >
                                            <div className="relative z-10 flex items-center gap-2">
                                                {alreadyInCart ? <ShoppingCart size={20} /> : <Tag size={20} />}
                                                <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:inline">
                                                    {alreadyInCart ? 'In Pantry' : 'Grab it'}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredFoods.length === 0 && (
                    <div className="text-center py-40 bg-white/50 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-gray-100">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Grid size={40} className="text-gray-300" />
                        </div>
                        <h4 className="text-3xl font-black text-gray-900 mb-2">Flavor Void Detected</h4>
                        <p className="text-gray-400 font-bold italic">No items found in this frequency. Try another category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const ShoppingBagIcon = ({ className, size }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export default Menu;
