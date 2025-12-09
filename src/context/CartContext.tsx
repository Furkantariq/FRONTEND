import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
    menuItemId: string
    name: string
    price: number
    quantity: number
    image?: string
    specialInstructions?: string
}

interface CartContextType {
    items: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (menuItemId: string) => void
    updateQuantity: (menuItemId: string, quantity: number) => void
    clearCart: () => void
    totalAmount: number
    totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('dining_cart')
        return savedCart ? JSON.parse(savedCart) : []
    })

    useEffect(() => {
        localStorage.setItem('dining_cart', JSON.stringify(items))
    }, [items])

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.menuItemId === newItem.menuItemId)
            if (existing) {
                return prev.map(i =>
                    i.menuItemId === newItem.menuItemId
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                )
            }
            return [...prev, newItem]
        })
    }

    const removeFromCart = (menuItemId: string) => {
        setItems(prev => prev.filter(i => i.menuItemId !== menuItemId))
    }

    const updateQuantity = (menuItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(menuItemId)
            return
        }
        setItems(prev => prev.map(i =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
        ))
    }

    const clearCart = () => {
        setItems([])
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            totalItems
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
