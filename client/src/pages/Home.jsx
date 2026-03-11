import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Clock, ThumbsUp, Sparkles, Percent } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();
    const isWednesday = new Date().getDay() === 3;
    const isStudent = user?.role === 'student';

    const getWeeklyCode = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const week = Math.ceil((((now - start) / 86400000) + start.getDay() + 1) / 7);
        return `WEDW${week}`;
    };

    const weeklyCode = getWeeklyCode();

    return (
        <div className="fade-in space-y-12">
            {/* Student Welcome Banner */}
            {isStudent && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-gray-800 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center font-black">
                            <Utensils size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black">Welcome back, {user.name}!</h3>
                            <p className="text-gray-400 text-sm font-medium">Ready for your favorite canteen meal today?</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-500">
                        <span className="bg-gray-800 px-3 py-1 rounded-md">Roll: {user.rollNo}</span>
                        <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-md">Student Account</span>
                    </div>
                </motion.div>
            )}

            {/* Wednesday Banner for Students (Persistent) */}
            {isStudent && (
                <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-500 rounded-[2rem] p-8 text-white shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                <Percent size={32} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Wednesday Special!</h3>
                                <p className="text-white/80 font-bold">
                                    Every Wednesday, get 25% OFF!
                                    {isWednesday ? (
                                        <span> Use code <span className="underline decoration-2 underline-offset-4">{weeklyCode}</span> in cart now!</span>
                                    ) : (
                                        <span> Next week's code will be <span className="bg-white/20 px-2 py-0.5 rounded italic">ready soon</span>.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {isWednesday ? (
                            <Link
                                to="/menu"
                                className="bg-white text-red-600 px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition-all shadow-lg animate-bounce"
                            >
                                ORDER NOW
                            </Link>
                        ) : (
                            <div className="bg-white/10 px-6 py-2 rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest">
                                Coming this Wednesday
                            </div>
                        )}
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <Sparkles className="absolute top-4 right-8 text-white/30" size={48} />
                </div>
            )}

            {/* Hero Section */}
            <section className="relative p-12 md:p-20 bg-gradient-to-br from-red-50 to-white rounded-[3rem] shadow-sm border border-red-50">
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tighter">
                            Fresh Food <br />
                            <span className="text-red-500 bg-clip-text">Delicious Taste</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 font-medium mb-10 max-w-xl mx-auto lg:mx-0">
                            Order your favorite meals from the UNOM CANTEEN and enjoy a seamless dining experience.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/menu" className="w-full sm:w-auto bg-red-500 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-red-200 hover:bg-red-600 transition-all hover:-translate-y-1">
                                Explore Menu <ArrowRight size={22} />
                            </Link>
                            <Link to="/orders" className="w-full sm:w-auto bg-white border-2 border-gray-100 text-gray-900 px-10 py-4 rounded-2xl font-black text-lg hover:border-red-500 transition-all">
                                Track Orders
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-red-200 to-orange-100 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <img
                            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Delicious Food"
                            className="relative w-full max-w-xl rounded-[3rem] shadow-2xl transform transition-transform group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why Choose Us?</h2>
                        <p className="text-gray-400 font-bold">Experience the best dining service on campus.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Utensils size={32} className="text-red-500" />}
                            title="Fresh Quality"
                            desc="We use only the freshest ingredients to prepare your meals daily."
                        />
                        <FeatureCard
                            icon={<Clock size={32} className="text-red-500" />}
                            title="Fast Service"
                            desc="Get your food ready in minutes with our optimized token system."
                        />
                        <FeatureCard
                            icon={<ThumbsUp size={32} className="text-red-500" />}
                            title="Best Taste"
                            desc="Our chefs are dedicated to providing the most delicious food."
                        />
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="bg-gray-900 p-12 rounded-[3.5rem] text-white">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black mb-4 tracking-tight">Find Us Here</h2>
                        <p className="text-gray-400 font-bold">Visit the UNOM CANTEEN on campus.</p>
                    </div>
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 grayscale group hover:grayscale-0 transition-all duration-700">
                        <iframe
                            width="100%"
                            height="450"
                            src="https://maps.google.com/maps?q=13.0827,80.2707&z=15&output=embed"
                            className="w-full border-none"
                            allowFullScreen
                            title="Canteen Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-50 group">
        <div className="bg-red-50 p-6 rounded-3xl mb-8 group-hover:bg-red-500 group-hover:rotate-12 transition-all">
            <div className="group-hover:text-white transition-colors">
                {icon}
            </div>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default Home;
