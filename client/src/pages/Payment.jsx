import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { CheckCircle, CreditCard, ShoppingBag, ArrowLeft, Loader2, ShieldCheck, Clock, QrCode, Wallet, Ticket, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'canteen'
    const [orderSuccess, setOrderSuccess] = useState(null);

    const { discount = 0, finalTotal = 0 } = location.state || {};

    // Generate UPI QR Code URL
    const upiId = "unomcanteen@upi";
    const merchantName = "UNOM Canteen";
    const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${finalTotal}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

    const handleConfirmOrder = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const orderData = {
                items: cart.map((item) => ({
                    food: item.food._id,
                    quantity: item.quantity,
                })),
                totalAmount: finalTotal,
                paymentMethod: paymentMethod,
                paymentStatus: paymentMethod === 'upi' ? 'Paid' : 'Pending', // Simulate UPI payment as paid
                status: 'Pending'
            };

            const res = await API.post("/orders", orderData);
            setOrderSuccess(res.data);
            clearCart();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to confirm order. Please try again.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 animate-pulse">
                        <CheckCircle size={48} className="text-white" />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
                    <p className="text-gray-500 font-bold mb-8 italic">Your meal is being prepared with love.</p>

                    <div className="bg-gray-900 rounded-[2rem] p-8 mb-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Your Order Token</p>
                            <h3 className="text-5xl font-black text-red-500 tracking-tighter">
                                #{orderSuccess.tokenNumber}
                            </h3>
                        </div>
                        <Sparkles className="absolute -top-4 -right-4 text-white/5" size={120} />
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/orders"
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl"
                        >
                            Track My Order <ArrowRight size={20} />
                        </Link>
                        <button
                            onClick={() => navigate('/menu')}
                            className="w-full bg-white border-2 border-gray-100 text-gray-500 py-4 rounded-2xl font-black text-lg hover:border-red-500 hover:text-red-500 transition-all"
                        >
                            Back to Menu
                        </button>
                    </div>

                    <p className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                        Please show this token at the canteen counter <br /> to collect your order.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (cart.length === 0 && !loading) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="bg-gray-50 rounded-[3rem] p-12 max-w-2xl mx-auto border-2 border-dashed border-gray-200">
                    <ShoppingBag className="mx-auto text-gray-300 mb-6" size={64} />
                    <h3 className="text-2xl font-black text-gray-900 mb-4 font-black">No items to confirm</h3>
                    <button onClick={() => navigate('/menu')} className="bg-red-500 text-white px-8 py-3 rounded-xl font-black shadow-lg">Back to Menu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors mb-10 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Summary */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Final <span className="text-red-500">Checkout</span></h2>
                            <p className="text-gray-500 font-bold">Please review your items before final confirmation.</p>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 border border-gray-50">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Wallet size={20} className="text-red-500" />
                                Select Payment Method
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 relative overflow-hidden group ${paymentMethod === 'upi' ? 'border-red-500 bg-red-50/30' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}`}>
                                        <QrCode size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">UPI Payment</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instant & Secure</p>
                                    </div>
                                    {paymentMethod === 'upi' && <div className="absolute top-4 right-4"><CheckCircle size={20} className="text-red-500" /></div>}
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('canteen')}
                                    className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 relative overflow-hidden group ${paymentMethod === 'canteen' ? 'border-red-500 bg-red-50/30' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === 'canteen' ? 'bg-gray-900 text-white' : 'bg-white text-gray-400'}`}>
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900">Pay at Canteen</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pay while collecting</p>
                                    </div>
                                    {paymentMethod === 'canteen' && <div className="absolute top-4 right-4"><CheckCircle size={20} className="text-red-500" /></div>}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <Clock size={20} className="text-red-500" />
                                    Order Items ({cart.length})
                                </h3>
                            </div>
                            <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.food._id} className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <img src={item.food.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                            <div>
                                                <h4 className="font-black text-gray-900">{item.food.name}</h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">₹{item.food.price} x {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-gray-900 font-black">₹{item.food.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Checkout or QR */}
                    <div className="bg-gray-900 rounded-[3rem] p-10 text-white h-fit shadow-2xl shadow-gray-300 lg:sticky lg:top-8">
                        <h3 className="text-2xl font-black mb-8 tracking-tight">Price Breakdown</h3>

                        {paymentMethod === 'upi' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 text-center bg-white p-6 rounded-[2rem]"
                            >
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 italic text-center mx-auto">Scan QR to Pay</p>
                                <img
                                    src={qrCodeUrl}
                                    alt="UPI QR Code"
                                    className="w-40 h-40 mx-auto mb-4 mix-blend-multiply"
                                />
                                <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-xs">
                                    <ShieldCheck size={14} className="text-green-500" /> Secure Encryption
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 font-bold">
                                <span>Subtotal</span>
                                <span>₹{(finalTotal + discount)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-red-400 font-bold">
                                    <span>Discount Applied</span>
                                    <span>- ₹{discount}</span>
                                </div>
                            )}
                            <div className="h-px bg-white/10 my-6"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black italic underline decoration-red-500 underline-offset-8">Total Amount</span>
                                <span className="text-4xl font-black text-red-500">₹{finalTotal}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmOrder}
                            disabled={loading}
                            className={`w-full py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${paymentMethod === 'upi' ? 'bg-red-500 hover:bg-red-600 shadow-red-900/40 text-white' : 'bg-white text-gray-900 hover:bg-gray-100 shadow-white/5'}`}
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin text-current" />
                            ) : (
                                <>Confirm Order <CheckCircle size={26} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;

