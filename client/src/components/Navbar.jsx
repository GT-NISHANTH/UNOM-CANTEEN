import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu as MenuIcon, Calendar, Clock, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { cart } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
    const isStudent = user?.role === 'student'
    const isCustomer = user?.role === 'customer'
    const isStudentOrCustomer = isStudent || isCustomer

    // Role-based design tokens
    const themeColor = isStudent ? 'red' : (isCustomer ? 'amber' : 'blue');
    const glowClass = isStudent ? 'shadow-red-500/20' : (isCustomer ? 'shadow-amber-500/20' : 'shadow-blue-500/20');

    const navLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `relative px-4 py-2 font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-white ${isActive ? 'text-white' : 'text-gray-400'
            }`;
    };

    if (location.pathname === '/login') {
        return (
            <header className="sticky top-0 z-[1000] w-full">
                <nav className="flex justify-center items-center bg-gray-950/95 backdrop-blur-2xl border-b border-white/5 py-5 transition-all duration-500">
                    <Link to="/" className="group flex items-center gap-4 transition-all">
                        <img src="/logo.png" alt="UNOM Logo" className="w-12 h-12 object-contain relative z-10 filter brightness-110" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white leading-none">UNOM</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500 mt-1">CANTEEN</span>
                        </div>
                    </Link>
                </nav>
            </header>
        );
    }

    return (

        <header className="sticky top-0 z-[1000] w-full">
            {/* Real-time Date and Time Bar - Premium Status Bar Style */}
            <AnimatePresence>
                {isStudentOrCustomer && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-black/90 backdrop-blur-md text-gray-500 py-2.5 px-8 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] border-b border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1 rounded-md bg-${themeColor}-500/10`}>
                                <Calendar size={10} className={`text-${themeColor}-500`} />
                            </div>
                            <span>
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'numeric',
                                    day: 'numeric',
                                    year: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${themeColor}-500 animate-pulse shadow-[0_0_8px] shadow-${themeColor}-500`} />
                                <span className="text-gray-400">Live Frequency</span>
                            </div>
                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                <Clock size={10} className={`text-${themeColor}-500`} />
                                <span className="text-white lining-nums">
                                    {currentTime.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Navbar - Glassmorphic Hero Style */}
            <nav className={`flex justify-between items-center bg-gray-950/95 backdrop-blur-2xl border-b border-white/5 px-8 py-5 transition-all duration-500`}>
                <Link to="/" className="group flex items-center gap-4 active:scale-95 transition-all">
                    <div className="relative">
                        <div className={`absolute inset-0 bg-${themeColor}-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
                        <img src="/logo.png" alt="UNOM Logo" className="w-12 h-12 object-contain relative z-10 filter brightness-110" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-white leading-none">UNOM</span>
                        <span className={`text-[9px] font-black uppercase tracking-[0.4em] text-${themeColor}-500 mt-1`}>Canteen System</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/5 mr-4 ring-1 ring-white/5">
                        <Link to="/menu" className={navLinkClass('/menu')}>
                            Menu
                            {location.pathname === '/menu' && <motion.div layoutId="nav-bg" className={`absolute inset-0 bg-${themeColor}-500/10 rounded-xl -z-10`} />}
                        </Link>

                        <Link to="/cart" className={navLinkClass('/cart')}>
                            Cart
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`ml-2 bg-${themeColor}-500 text-white rounded-lg px-1.5 py-0.5 text-[8px] font-black shadow-lg ${glowClass}`}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {location.pathname === '/cart' && <motion.div layoutId="nav-bg" className={`absolute inset-0 bg-${themeColor}-500/10 rounded-xl -z-10`} />}
                        </Link>

                        <Link to="/orders" className={navLinkClass('/orders')}>
                            Orders
                            {location.pathname === '/orders' && <motion.div layoutId="nav-bg" className={`absolute inset-0 bg-${themeColor}-500/10 rounded-xl -z-10`} />}
                        </Link>

                        {user?.role === 'admin' && (
                            <Link to="/admin" className={navLinkClass('/admin')}>
                                Admin
                                {location.pathname === '/admin' && <motion.div layoutId="nav-bg" className={`absolute inset-0 bg-${themeColor}-500/10 rounded-xl -z-10`} />}
                            </Link>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-5 pl-4 border-l border-white/10">
                            {user.role === 'student' && user.photo && (
                                <img src={user.photo} alt="Student Profile" className={`w-9 h-9 rounded-full object-cover border-2 border-${themeColor}-500 shadow-lg ${glowClass}`} />
                            )}
                            <div className="flex flex-col items-end">
                                <span className="text-white text-[11px] font-black tracking-tight leading-none">{user.name}</span>
                                <span className={`text-[7px] font-black uppercase tracking-widest text-${themeColor}-500 mt-1`}>{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`group p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-black hover:border-${themeColor}-500/50 text-gray-400 hover:text-${themeColor}-500 transition-all active:scale-90`}
                                title="Exit Session"
                            >
                                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl ${glowClass} active:scale-95`}
                        >
                            <User size={16} />
                            Access Account
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
