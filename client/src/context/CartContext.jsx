import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (food) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.food._id === food._id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.food._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { food, quantity: 1 }];
        });
    };

    const removeFromCart = (foodId) => {
        setCart((prevCart) => prevCart.filter((item) => item.food._id !== foodId));
    };

    const updateQuantity = (foodId, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.food._id === foodId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((total, item) => total + item.food.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
