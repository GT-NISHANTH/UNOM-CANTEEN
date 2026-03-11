import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
    ShoppingBag, Trash2, ArrowRight, CreditCard, ShoppingCart,
    Ticket, Percent, Minus, Plus, Zap, ShieldCheck, ChevronRight, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Cart() {
    const { cart, totalAmount, clearCart, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState("");

    const getWeeklyCode = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const week = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
        return `WEDW${week}`;
    };

    const weeklyCode = getWeeklyCode();
    const isWednesday = new Date().getDay() === 3;
    const isStudent = user?.role === 'student';
    const isCustomer = user?.role === 'customer';

    const themeColor = isStudent ? 'red' : (isCustomer ? 'amber' : 'blue');
    const themeGradient = isStudent ? 'from-red-600 to-orange-500' : 'from-amber-400 to-yellow-600';

    const handleApplyCoupon = () => {
        if (!isWednesday) {
            alert("Discounts can only be applied on Wednesdays!");
            return;
        }
        if (coupon.toUpperCase() === weeklyCode) {
            setDiscount(totalAmount * 0.25);
            setCouponError("");
            alert(`Success! ${weeklyCode} applied for 25% discount.`);
        } else {
            setCouponError(`Invalid code. Check home banner!`);
            setDiscount(0);
        }
    };

    const finalTotal = totalAmount - discount;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (cart.length === 0) return;
        navigate('/payment', { state: { discount, finalTotal } });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-16">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Asymmetric Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 bg-${themeColor}-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-${themeColor}-500/20`}>
                                <ShoppingCart size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Pantry Overflow</span>
                        </div>
                        <h2 className="text-6xl font-black text-gray-900 tracking-tighter">Your <span className={`text-${themeColor}-500 italic underline decoration-8 underline-offset-[-2px] decoration-${themeColor}-100`}>Tray.</span></h2>
                    </motion.div>

                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/20">
                        <div className="flex -space-x-3">
                            {cart.slice(0, 3).map((item, i) => (
                                <img key={i} src={item.food.image} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" alt="Preview" />
                            ))}
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">{cart.length} Reserved Items</p>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[4rem] py-32 text-center border border-gray-100 shadow-2xl shadow-gray-200/30 flex flex-col items-center"
                    >
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-10 relative">
                            <ShoppingBag className="text-gray-200" size={64} />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent rounded-full animate-pulse" />
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-4 uppercase">The tray is hollow</h3>
                        <p className="text-gray-400 font-bold italic mb-10 max-w-xs">Your personal canteen experience starts with the first selection.</p>
                        <Link to="/menu" className={`group bg-gray-950 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-${themeColor}-500 transition-all shadow-2xl shadow-gray-900/10`}>
                            Fill the Tray <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Item Tray Section */}
                        <div className="lg:col-span-7 space-y-6">
                            <AnimatePresence>
                                {cart.map((item, idx) => (
                                    <motion.div
                                        key={item.food._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-gray-200/30 border border-gray-100 flex flex-col md:flex-row items-center gap-10 group hover:border-gray-900 transition-all duration-500"
                                    >
                                        <div className="relative w-40 h-40 shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                            <img
                                                src={item.food.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"}
                                                className="w-full h-full rounded-[2.8rem] object-cover shadow-2xl transition-transform duration-700 group-hover:scale-105"
                                                alt={item.food.name}
                                            />
                                        </div>

                                        <div className="flex-1 text-center md:text-left overflow-hidden">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <span className={`text-[8px] font-black uppercase tracking-[0.4em] text-${themeColor}-500 mb-1 block`}>{item.food.category}</span>
                                                    <h3 className="text-3xl font-black text-gray-900 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500">{item.food.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{item.food.price * item.quantity}</p>
                                                    <p className="text-[9px] font-black text-gray-400 italic">₹{item.food.price} Per Serving</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 border-t border-gray-50 pt-6">
                                                <div className="flex items-center bg-gray-50 rounded-full p-2 ring-1 ring-gray-100 shadow-inner">
                                                    <button
                                                        onClick={() => updateQuantity(item.food._id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-all active:scale-90"
                                                    >
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className="w-14 text-center font-black text-xl text-gray-900 lining-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.food._id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg text-gray-400 hover:text-${themeColor}-500 transition-all active:scale-90"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.food._id)}
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 p-4 transition-all"
                                                >
                                                    <Trash2 size={16} /> Eject Item
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Dynamic Coupon Area */}
                            {isStudent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`relative overflow-hidden bg-gradient-to-br ${themeGradient} rounded-[3.5rem] p-10 text-white shadow-2xl shadow-${themeColor}-500/20`}
                                >
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/20 shrink-0">
                                            <Zap size={32} className="text-white fill-white" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="text-3xl font-black italic tracking-tighter">Student Rush Hour.</h4>
                                            <p className="text-white/70 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Activate your 25% Wednesday Perk</p>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            <div className="flex bg-black/20 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                                                <input
                                                    type="text"
                                                    placeholder="Enter Code"
                                                    className="bg-transparent px-6 py-4 w-full md:w-40 border-none outline-none font-black uppercase text-xs placeholder:text-white/40 tracking-widest"
                                                    value={coupon}
                                                    onChange={(e) => setCoupon(e.target.value)}
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    className="bg-white text-gray-900 px-8 py-4 rounded-xl font-black text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                                >
                                                    Inject
                                                </button>
                                            </div>
                                            {couponError && <p className="text-[8px] font-black uppercase tracking-[0.3em] text-yellow-300 ml-2 animate-pulse">{couponError}</p>}
                                        </div>
                                    </div>
                                    <Percent size={200} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                                </motion.div>
                            )}
                        </div>

                        {/* Bento Summary Panel */}
                        <div className="lg:col-span-5 lg:sticky lg:top-24">
                            <div className="bg-gray-950 rounded-[4rem] p-10 text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${themeColor}-500 blur-[100px] opacity-20`} />

                                <h3 className="text-4xl font-black mb-10 tracking-tighter">Command <span className="text-gray-500">Center</span></h3>

                                <div className="space-y-6 mb-12">
                                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Gross Total</span>
                                        <span className="text-2xl font-black tracking-tighter">₹{totalAmount}</span>
                                    </div>

                                    {discount > 0 && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="flex justify-between items-center bg-green-500/10 p-6 rounded-[2rem] border border-green-500/20 text-green-400"
                                        >
                                            <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"><Percent size={14} /> Perks applied</span>
                                            <span className="text-2xl font-black tracking-tighter">- ₹{discount}</span>
                                        </motion.div>
                                    )}

                                    <div className="bg-white/5 p-8 rounded-[3rem] border-2 border-dashed border-white/10 group-hover:border-${themeColor}-500/30 transition-colors">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Net Frequency</span>
                                            <span className="text-xs font-black uppercase tracking-widest text-green-500 italic">Ready to Serve</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-5xl font-black tracking-tighter">₹{finalTotal}</span>
                                            <span className="text-[10px] font-black text-gray-600 pb-2">All Taxes Inc.</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    className={`w-full bg-${themeColor}-500 py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-${themeColor}-500/40 relative group overflow-hidden`}
                                >
                                    <div className="relative z-10 flex items-center gap-4">
                                        Ship Order <ArrowRight size={24} className="group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </motion.button>

                                <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Security Node</span>
                                        <div className="flex items-center gap-2 text-white/40 group-hover:text-green-500 transition-colors">
                                            <ShieldCheck size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/10">
                                        <Sparkles size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
