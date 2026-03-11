import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
    const { addToCart, cart } = useCart();
    const isInCart = cart.some(item => item.food._id === food._id);

    return (
        <div className="glass" style={{
            borderRadius: '24px',
            overflow: 'hidden',
            transition: 'var(--transition)',
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={food.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                    alt={food.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="food-img"
                />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>{food.name}</h3>
                    <span style={{
                        background: 'var(--bg-soft)',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        textTransform: 'capitalize',
                        color: 'var(--text-muted)'
                    }}>
                        {food.category}
                    </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{food.price}</span>
                    <button
                        onClick={() => addToCart(food)}
                        style={{
                            background: isInCart ? '#48bb78' : 'var(--primary)',
                            color: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: isInCart ? 'none' : '0 4px 12px rgba(255, 77, 77, 0.3)'
                        }}
                    >
                        {isInCart ? <Check size={20} /> : <Plus size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
