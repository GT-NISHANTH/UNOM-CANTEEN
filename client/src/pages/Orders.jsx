import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { io } from "socket.io-client";
import {
    Clock, CheckCircle2, Package, Search, Star, MessageSquare,
    IndianRupee, History, TrendingUp, Calendar, ChevronRight,
    ArrowUpRight, Sparkles, MapPin, Coffee, UtensilsCrossed
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Initialize socket
const socket = io("http://localhost:5000");

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isStudent = user?.role === 'student';
    // Theme colors based on role
    const themeColor = isStudent ? 'red' : 'amber';
    const themeHex = isStudent ? '#ef4444' : '#f59e0b';
    const themeGradient = isStudent
        ? 'from-red-500 to-orange-500'
        : 'from-amber-400 to-yellow-600';

    useEffect(() => {
        if (user) {
            fetchOrders();
        }

        socket.on("orderUpdated", (updatedOrder) => {
            if (user && (updatedOrder.user === user._id || updatedOrder.user?._id === user._id)) {
                fetchOrders();
            }
        });

        return () => {
            socket.off("orderUpdated");
        };
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await API.get(`/orders/user/${user._id}`);
            setOrders(res.data.reverse());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status) => {
        const statuses = ['pending', 'preparing', 'ready', 'delivered'];
        return statuses.indexOf(status?.toLowerCase());
    };

    const getFavoriteCategory = () => {
        if (orders.length === 0) return "None";
        const counts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const cat = item.food.category || "Unknown";
                counts[cat] = (counts[cat] || 0) + 1;
            });
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    };

    const analytics = {
        totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
        totalOrders: orders.length,
        favoriteCategory: getFavoriteCategory(),
        nextFreebie: 5 - (orders.length % 5)
    };

    const StatusTimeline = ({ currentStatus }) => {
        const steps = [
            { id: 'pending', label: 'Order Placed', time: 'Just now' },
            { id: 'preparing', label: 'Chef is Cooking', time: 'In progress' },
            { id: 'ready', label: 'Ready for Pickup', time: 'Almost there' },
            { id: 'delivered', label: 'Enjoy your Meal', time: 'Delivered' },
        ];
        const currentIndex = getStatusIndex(currentStatus);

        return (
            <div className="space-y-6 relative ml-4">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-2 left-0 w-0.5 bg-gray-100"></div>

                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="relative pl-8 group">
                            <div className={`absolute left-[-5px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-500 z-10
                                ${isActive ? `bg-${themeColor}-500 ring-4 ring-${themeColor}-50` : 'bg-gray-200'}`}
                            />
                            {isCurrent && (
                                <div className={`absolute left-[-13px] top-[-5px] w-7 h-7 bg-${themeColor}-500/20 rounded-full animate-ping z-0`} />
                            )}

                            <div className={`transition-all ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                                <h6 className={`text-xs font-black uppercase tracking-widest ${isActive ? `text-${themeColor}-500` : 'text-gray-400'}`}>
                                    {step.label}
                                </h6>
                                <p className="text-[10px] font-bold text-gray-400">{step.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/30 overflow-hidden relative">
            {/* Background Decorative Blobs */}
            <div className={`absolute -top-24 -left-24 w-96 h-96 bg-${themeColor}-500/5 rounded-full blur-[100px] pointer-events-none`} />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-400/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 py-16 max-w-7xl relative z-10">
                {/* Unique Header Section */}
                <div className="grid lg:grid-cols-3 gap-12 items-end mb-20">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-4"
                        >
                            <span className={`px-4 py-1.5 bg-${themeColor}-500/10 text-${themeColor}-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                                {user?.role} portal
                            </span>
                            <Sparkles size={16} className={`text-${themeColor}-400`} />
                        </motion.div>
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none">
                            Taste <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeGradient}`}>History</span>
                        </h2>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                        <AnalyticsCard
                            icon={<IndianRupee size={18} />}
                            label="Wallet Spent"
                            value={`₹${analytics.totalSpent}`}
                            themeColor={themeColor}
                        />
                        <AnalyticsCard
                            icon={<History size={18} />}
                            label="Adventures"
                            value={analytics.totalOrders}
                            themeColor={themeColor}
                        />
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Side: Orders Timeline */}
                    <div className="lg:col-span-8 space-y-16">
                        <AnimatePresence mode="popLayout">
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="relative pl-12 md:pl-0"
                                >
                                    {/* Timeline Date Marker (Desktop) */}
                                    <div className="hidden md:block absolute left-[-160px] top-10 text-right w-[140px]">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-${themeColor}-500 mb-1`}>
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-3xl font-black text-gray-900 tracking-tighter">
                                            {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </p>
                                    </div>

                                    {/* Connection Node */}
                                    <div className={`hidden md:flex absolute left-[-20px] top-12 w-10 h-10 bg-white border-2 border-${themeColor}-500 rounded-2xl items-center justify-center z-20 shadow-xl shadow-${themeColor}-100 transition-transform hover:scale-110`}>
                                        <Coffee size={18} className={`text-${themeColor}-500`} />
                                    </div>

                                    {/* Order Content */}
                                    <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 group hover:border-red-100 transition-all duration-500 relative overflow-hidden">
                                        {/* Glass Overlay for Token */}
                                        <div className="absolute top-0 right-0 p-8">
                                            <div className="bg-gray-900/5 backdrop-blur-md border border-gray-900/10 px-6 py-3 rounded-2xl text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Token ID</p>
                                                <p className={`text-4xl font-black italic tracking-tighter text-${themeColor}-500`}>#{order.tokenNumber}</p>
                                            </div>
                                        </div>

                                        <div className="pt-16 md:pt-0">
                                            <div className="grid md:grid-cols-2 gap-12">
                                                {/* Items Info */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-8">
                                                        <UtensilsCrossed size={16} className="text-gray-300" />
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Delicacies</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {order.items.map((item, i) => (
                                                            <div key={i} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center font-black text-xs shadow-sm text-${themeColor}-500`}>
                                                                        {item.quantity}x
                                                                    </div>
                                                                    <span className="font-bold text-gray-800">{item.food.name}</span>
                                                                </div>
                                                                <span className="font-black text-gray-900">₹{item.food.price * item.quantity}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="mt-10 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-red-400" />
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">UNOM Canteen Area 1</span>
                                                        </div>
                                                        <p className="text-sm font-black text-gray-900 underline decoration-gray-100 underline-offset-8">Total ₹{order.totalAmount}</p>
                                                    </div>
                                                </div>

                                                {/* Live Tracker Sidebar */}
                                                <div className="bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 flex flex-col justify-center">
                                                    <div className="text-center mb-8">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Progress</p>
                                                        <div className={`inline-flex items-center gap-2 bg-white px-6 py-1.5 rounded-full shadow-sm ring-1 ring-gray-100`}>
                                                            <span className={`w-2 h-2 rounded-full bg-${themeColor}-500 animate-pulse`} />
                                                            <span className="text-xs font-black uppercase text-gray-700">{order.status}</span>
                                                        </div>
                                                    </div>
                                                    <StatusTimeline currentStatus={order.status} />
                                                </div>
                                            </div>

                                            <div className="mt-12 flex items-center justify-between gap-4">
                                                <Link
                                                    to="/tracking"
                                                    className={`flex-1 bg-gray-900 text-white rounded-3xl py-5 font-black text-sm flex items-center justify-center gap-3 hover:bg-${themeColor}-500 transition-all shadow-xl shadow-gray-200`}
                                                >
                                                    Live Interaction <ArrowUpRight size={18} />
                                                </Link>
                                                <button className={`p-5 bg-gray-50 text-gray-400 rounded-3xl hover:text-${themeColor}-500 transition-colors border border-gray-100`}>
                                                    <MessageSquare size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {orders.length === 0 && !loading && (
                            <div className="text-center py-40">
                                <div className={`w-32 h-32 bg-${themeColor}-500/10 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner`}>
                                    <ShoppingBagIcon className={`text-${themeColor}-500`} size={48} />
                                </div>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">No culinary history yet</h3>
                                <p className="text-gray-400 font-bold max-w-xs mx-auto mb-10 leading-relaxed italic">Your taste buds are waiting for their first UNOM canteen story to begin.</p>
                                <Link
                                    to="/menu"
                                    className={`bg-gray-900 text-white px-12 py-5 rounded-3xl font-black shadow-2xl shadow-gray-300 hover:bg-${themeColor}-500 hover:-translate-y-1 transition-all inline-block`}
                                >
                                    Begin Adventure
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Quick Stats / Promotion */}
                    <div className="lg:col-span-4 space-y-8 sticky top-32 h-fit">
                        <div className={`bg-gradient-to-br ${themeGradient} rounded-[3.5rem] p-10 text-white shadow-2xl shadow-${themeColor}-200/50 relative overflow-hidden group`}>
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 5 }}
                                className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                            />
                            <h4 className="text-2xl font-black mb-6 tracking-tighter leading-tight">Member Perks <br /> & Analytics</h4>

                            <div className="space-y-6">
                                <div className="bg-white/10 p-5 rounded-3xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Next Freebie</p>
                                    <div className="flex items-end justify-between">
                                        <p className="font-bold">{analytics.nextFreebie} orders left</p>
                                        <TrendingUp size={20} className="text-white/40" />
                                    </div>
                                    <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full bg-white rounded-full`} style={{ width: `${(orders.length % 5) * 20}%` }} />
                                    </div>
                                </div>

                                <div className="bg-white/10 p-5 rounded-3xl border border-white/5 backdrop-blur-sm">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Top Choice</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-xs">🍔</div>
                                        <p className="font-bold uppercase text-xs tracking-widest">{analytics.favoriteCategory}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => alert("Successfully upgraded to Premium! You can now enjoy exclusive perks.")}
                                className="w-full mt-10 bg-white text-gray-900 py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                            >
                                Upgrade Profile
                            </button>
                        </div>

                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-100/30">
                            <h4 className="text-lg font-black text-gray-900 mb-6 tracking-tight">Need Support?</h4>
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">Our canteen staff is here to help you between 8:00 AM - 6:00 PM.</p>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Clock size={18} />
                                    </div>
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <IndianRupee size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AnalyticsCard = ({ icon, label, value, themeColor }) => (
    <div className={`bg-white border border-gray-100 px-8 py-5 rounded-[2.5rem] shadow-xl shadow-gray-100/50 flex items-center gap-6 min-w-[220px] group hover:border-${themeColor}-100 transition-colors`}>
        <div className={`w-12 h-12 bg-${themeColor}-500/10 text-${themeColor}-600 rounded-2xl flex items-center justify-center group-hover:bg-${themeColor}-500 group-hover:text-white transition-all`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-2xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
    </div>
);

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

export default Orders;
