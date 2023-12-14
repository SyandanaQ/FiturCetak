// CartItem.js
import React from 'react';
import { Button } from 'primereact/button';

const cartItemStyles = {
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        padding: '10px'
    },
    info: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    name: {
        // fontSize: '16px',
        fontWeight: 'bold',
    },
    price: {
        // fontSize: '14px',
        color: '#777',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
    },
    quantity: {
        margin: '0 10px',
        // fontSize: '14px',
    },
};

function CartItem({ item, updateQuantity, removeFromCart }) {
    return (
        <div style={cartItemStyles.container}>
            <div style={cartItemStyles.info}>
                <div style={cartItemStyles.name}>{item.name}</div>
                <div style={cartItemStyles.price}>{item.price}</div>
            </div>
            <div style={cartItemStyles.actions}>
                <Button
                    icon="pi pi-plus"
                    className="p-button-success p-button-sm"
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                />
                <span style={cartItemStyles.quantity}>Qty: {item.qty}</span>
                <Button
                    icon="pi pi-minus"
                    className="p-button-warning p-button-sm"
                    onClick={() => {
                        if (item.qty > 1) {
                            updateQuantity(item.id, item.qty - 1);
                        }
                        else if (item.qty === 1) {
                            removeFromCart(item.id);
                        }
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-danger p-button-sm"
                    onClick={() => removeFromCart(item.id)}
                />
            </div>
        </div>
    );
}

export default CartItem;
