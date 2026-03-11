import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, ShoppingBag, Plus, Trash2, Edit, Loader2, Save, X, Utensils, ClipboardList, CheckCircle2, LayoutDashboard, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState({ totalSales: 0, totalOrders: 0 });
    const [foods, setFoods] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingFood, setIsAddingFood] = useState(false);
    const [newFood, setNewFood] = useState({ name: '', price: '', category: '', availability: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, foodsRes, ordersRes] = await Promise.all([
                    API.get('/orders/sales/today'),
                    API.get('/food'),
                    API.get('/orders')
                ]);
                setSales(salesRes.data[0] || { totalSales: 0, totalOrders: 0 });
                setFoods(foodsRes.data);
                setOrders(ordersRes.data.reverse());
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}`, { status: newStatus });
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/food', newFood);
            setFoods([...foods, res.data]);
            setIsAddingFood(false);
            setNewFood({ name: '', price: '', category: '', availability: true });
        } catch (err) {
            alert('Failed to add food');
        }
    };

    const handleDeleteFood = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await API.delete(`/food/${id}`);
            setFoods(foods.filter(f => f._id !== id));
        } catch (err) {
            alert('Failed to delete food');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="text-red-500" size={48} />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Access Denied</h1>
                <p className="text-gray-400 font-bold">You do not have permission to view this page.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-red-500 mb-4" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Initializing Admin Console...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="text-red-500" size={24} />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Control Center</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic">Canteen <span className="text-red-500">Master</span></h1>
                </div>
                <div className="flex gap-4">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-3xl flex items-center gap-4">
                        <div className="bg-green-100 p-2 rounded-xl">
                            <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Today's Revenue</p>
                            <p className="text-xl font-black text-gray-900">₹{sales.totalSales}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-3xl flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <ShoppingBag size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Daily Volume</p>
                            <p className="text-xl font-black text-gray-900">{sales.totalOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Manage Menu */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-100 border border-gray-50 h-fit sticky top-8">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <Utensils size={24} className="text-gray-400" />
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center">Menu Editor</h2>
                            </div>
                            <button
                                onClick={() => setIsAddingFood(true)}
                                className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-100 hover:scale-110 transition-all active:scale-95"
                            >
                                <Plus size={24} />
                            </button>
                        </div>

                        {isAddingFood && (
                            <form onSubmit={handleAddFood} className="bg-gray-50 p-6 rounded-3xl mb-8 border border-gray-100 animate-slide-down">
                                <div className="space-y-4">
                                    <input type="text" placeholder="Item Name" required className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 font-bold transition-all" value={newFood.name} onChange={e => setNewFood({ ...newFood, name: e.target.value })} />
                                    <input type="number" placeholder="Price (₹)" required className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 font-bold transition-all" value={newFood.price} onChange={e => setNewFood({ ...newFood, price: e.target.value })} />
                                    <input type="text" placeholder="Category (e.g. Snacks)" required className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 font-bold transition-all" value={newFood.category} onChange={e => setNewFood({ ...newFood, category: e.target.value })} />
                                    <input type="text" placeholder="Image URL (Direct link)" className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 font-bold transition-all" value={newFood.image} onChange={e => setNewFood({ ...newFood, image: e.target.value })} />
                                    <textarea placeholder="Description / Opinion" className="w-full bg-white px-5 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-100 font-bold transition-all" value={newFood.description} onChange={e => setNewFood({ ...newFood, description: e.target.value })} rows={3} />
                                    <div className="flex gap-3">
                                        <button type="submit" className="flex-1 bg-gray-900 text-white py-3 rounded-2xl font-black shadow-lg hover:shadow-gray-200 transition-all flex items-center justify-center gap-2"><Save size={18} /> Save</button>
                                        <button type="button" onClick={() => setIsAddingFood(false)} className="bg-white border border-gray-100 text-gray-400 p-3 rounded-2xl hover:text-red-500 transition-all"><X size={20} /></button>
                                    </div>
                                </div>
                            </form>
                        )}

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {foods.map(food => (
                                <div key={food._id} className="group bg-white border border-gray-50 p-4 rounded-3xl flex justify-between items-center hover:border-red-100 transition-all hover:shadow-xl hover:shadow-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-xs font-black text-gray-300">
                                            {food.image ? <img src={food.image} className="w-full h-full object-cover" /> : <Utensils size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-gray-900 tracking-tight leading-none mb-1">{food.name}</h4>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">₹{food.price} • {food.category}</p>
                                            {food.description && <p className="text-[10px] text-gray-400 italic line-clamp-1">{food.description}</p>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteFood(food._id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-2 transition-all hover:scale-110">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Orders */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ClipboardList size={28} className="text-gray-900" />
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Traffic</h2>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                            Incoming Orders
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 border border-gray-50 hover:shadow-2xl transition-all duration-300">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-start gap-8">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Token</p>
                                            <p className="text-4xl font-black text-gray-900">#{order.tokenNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer / Roll No</p>
                                            <h4 className="text-lg font-black text-gray-900">{order.user?.name || 'Guest'}</h4>
                                            <p className="text-xs text-gray-400 font-bold">{order.user?.rollNo ? `Student: ${order.user.rollNo}` : 'General Customer'}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-[300px] border-l border-gray-100 pl-8 overflow-hidden">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Order Items</p>
                                        <div className="flex flex-wrap gap-2 truncate">
                                            {order.items.map((it, i) => (
                                                <span key={i} className="bg-gray-50 text-gray-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-gray-100">
                                                    {it.food.name} <span className="text-red-500 ml-1">x{it.quantity}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className={`appearance-none font-black text-center px-6 py-3 rounded-2xl text-xs uppercase cursor-pointer transition-all shadow-lg shadow-gray-100 border-none ring-2 ring-transparent focus:ring-red-100 ${order.status === 'Delivered' ? 'bg-green-500 text-white' :
                                                order.status === 'Ready' ? 'bg-blue-500 text-white' :
                                                    'bg-orange-500 text-white'
                                                }`}
                                        >
                                            <option value="Preparing">Preparing</option>
                                            <option value="Ready">Ready</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                        <p className="text-right text-lg font-black text-gray-900 italic">₹{order.totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {orders.length === 0 && (
                            <div className="text-center py-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem]">
                                <ShoppingBag className="mx-auto text-gray-300 mb-6" size={64} />
                                <h3 className="text-2xl font-black text-gray-400 tracking-tight">Canteen is quiet right now</h3>
                                <p className="text-gray-400 font-bold italic mt-2">No active orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
