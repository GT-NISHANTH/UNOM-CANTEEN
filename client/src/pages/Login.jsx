import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Phone, Lock, User, Mail, Hash, ShieldCheck, Users, GraduationCap, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer'); // student, customer, admin
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        password: '',
        rollNo: '',
        username: '',
        email: '',
        confirmPassword: ''
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Strict 8-digit roll number validation for students
        if (role === 'student' && !/^\d{8}$/.test(formData.rollNo)) {
            setError('Student Roll Number must be exactly 8 digits.');
            return;
        }

        // Student Photo Upload validation for registration
        if (!isLogin && role === 'student' && !photo) {
            setError('Student Photo is mandatory for registration.');
            return;
        }

        // Admin Confirm Password validation for registration
        if (!isLogin && role === 'admin' && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                let credentials = { role };
                if (role === 'student') {
                    if (!formData.rollNo || !formData.mobile) {
                        setError('Roll Number and Mobile are required for students.');
                        setLoading(false);
                        return;
                    }
                    credentials = { ...credentials, rollNo: formData.rollNo, mobile: formData.mobile };
                }
                else if (role === 'admin') credentials = { ...credentials, username: formData.username, email: formData.email, password: formData.password };
                else credentials = { ...credentials, mobile: formData.mobile, password: formData.password };

                await login(credentials);
                // Redirect students to their orders/history page immediately
                if (role === 'student') navigate('/orders');
                else navigate('/');
            } else {
                let registerData = { ...formData, role };
                if (role === 'student' && photoPreview) {
                    registerData.photo = photoPreview; // Send base64 to backend
                }

                await register(registerData);
                setIsLogin(true);
                alert('Registration successful! Please login.');
                setPhoto(null);
                setPhotoPreview('');
            }
        } catch (err) {
            console.error('Login error:', err);
            const message = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials and connection.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: GraduationCap },
        { id: 'customer', label: 'Customer', icon: Users },
        { id: 'admin', label: 'Admin', icon: ShieldCheck },
    ];

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('Photo must be less than 2MB');
                return;
            }
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex w-full max-w-6xl min-h-[800px] border border-gray-100">

                {/* Left Side - Animated Illustration */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 items-center justify-center p-12 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 opacity-80 z-0"></div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                        >
                            <motion.img
                                src={`/login_${role}.png`}
                                alt={`${role} illustration`}
                                className="w-full max-w-md object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <div className="mt-12 text-center text-white">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl font-black mb-4 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600"
                                >
                                    {role === 'student' ? 'Student Portal' : role === 'admin' ? 'Admin Control Flow' : 'Quick & Delicious'}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-300 text-lg max-w-sm mx-auto leading-relaxed"
                                >
                                    {role === 'student' ? 'Access exclusive student discounts and perfectly timed meals tailored for your schedule.' :
                                        role === 'admin' ? 'Manage active orders, update menus, and keep the UNOM CANTEEN running smoothly.' :
                                            'The fastest way to satisfy your cravings. Order your favorite meals effortlessly.'}
                                </motion.p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Decorative Background Blobs */}
                    <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
                    <div className="max-w-md w-full mx-auto">

                        <div className="text-center mb-10">
                            <motion.img
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                src="/logo.png"
                                alt="UNOM Logo"
                                className="w-20 h-20 mx-auto mb-6 object-contain drop-shadow-xl lg:hidden animate-bounce-slow"
                            />
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-black text-gray-900 mb-3 tracking-tight"
                            >
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-gray-500 font-medium"
                            >
                                {isLogin ? 'Login to enjoy your favorite meals' : 'Join the UNOM CANTEEN community'}
                            </motion.p>
                        </div>

                        {/* Role Tabs */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl mb-8 border border-gray-200"
                        >
                            {roles.map((r) => {
                                const Icon = r.icon;
                                const isActive = role === r.id;
                                return (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => { setRole(r.id); setError(''); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-xl shadow-md"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon size={18} />
                                            {r.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </motion.div>

                        <AnimatePresence mode="popLayout">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {/* Admin/Registration Specific Fields */}
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group"
                                    >
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                {/* Admin Only Fields (Login & Register) */}
                                {role === 'admin' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group"
                                    >
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                {/* Student Only Fields (Login & Register) */}
                                {role === 'student' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group space-y-5"
                                    >
                                        <div className="relative group">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Register Number (8 Digits Only)"
                                                required
                                                maxLength="8"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                                value={formData.rollNo}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, ''); // Only allow digits
                                                    setFormData({ ...formData, rollNo: val });
                                                }}
                                            />
                                            {isLogin && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Required</span>}
                                        </div>

                                        {!isLogin && (
                                            <div className="relative group">
                                                <div className="flex items-center gap-4 bg-gray-50/50 border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 transition-all">
                                                    <div className="relative w-16 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-red-400 transition-colors">
                                                        {photoPreview ? (
                                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon className="text-gray-400" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-bold text-gray-700 mb-1 cursor-pointer">
                                                            Student Photo <span className="text-red-500">*</span>
                                                        </label>
                                                        <label className="text-xs text-gray-500 cursor-pointer block hover:text-red-500 transition-colors">
                                                            Click to upload (Max 2MB)
                                                            <input type="file" accept="image/*" className="hidden" required onChange={handlePhotoChange} />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Mobile Field (Everyone except Admin Login) */}
                                {(role !== 'admin' || !isLogin) && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group"
                                    >
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                {/* Admin Specific Email Field */}
                                {role === 'admin' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="relative group"
                                    >
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </motion.div>
                                )}

                                {/* Password Field (Everyone except Student) */}
                                {role !== 'student' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-5"
                                    >
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                required
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>

                                        {/* Admin Confirm Password Mapping */}
                                        {!isLogin && role === 'admin' && (
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-red-500 transition-all outline-none font-medium text-gray-900 shadow-sm"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200/50 transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-8 border border-red-400/20"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    isLogin ? <><LogIn size={22} /> Sign In to Canteen</> : <><UserPlus size={22} /> Join Now</>
                                )}
                            </motion.button>
                        </form>

                        <div className="text-center mt-10">
                            <p className="text-gray-500 font-medium">
                                {isLogin ? "New to UNOM CANTEEN?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                    className="text-red-500 ml-2 font-bold hover:text-red-600 transition-colors focus:outline-none"
                                >
                                    {isLogin ? 'Create an Account' : 'Sign In instead'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
