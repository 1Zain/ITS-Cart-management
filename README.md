# Shopping Cart Management System

A shopping cart management system built with vanilla JavaScript and Tailwind CSS. Features complete CRUD operations, quantity management, and promo code functionality.

## ✨ Features

- ✅ Add, Edit, Delete cart items
- ✅ Quantity management with order limits
- ✅ Promo code system (percentage & fixed discounts)
- ✅ Automatic price calculations (subtotal, shipping, discount, total)
- ✅ Responsive design

## 🚀 Quick Start

1. Open `cart.html` in your web browser
2. The cart loads with 3 default items
3. Use **"+ Add Item"** to add new products

## 📁 Files

- `cart.html` - Main HTML file with cart UI
- `index.js` - JavaScript logic for cart management

## 🎯 How to Use

### Managing Items
- **Add Item**: Click "+ Add Item" button, fill form, click Save
- **Edit Item**: Click pencil icon on any item, modify, click Save
- **Delete Item**: Click X icon, confirm deletion
- **Change Quantity**: Use +/- buttons on each item

### Promo Codes
Enter a promo code and click **Apply**. Available codes:

| Code | Discount |
|------|----------|
| `SAVE10` | 10% off |
| `SAVE20` | 20% off |
| `WELCOME` | 15% off |
| `DEAL30` | 30% off |
| `FREESHIP` | Free shipping |
| `FLAT50` | $50 off |

Click the **✕** button next to the discount to remove it.

## 🎯 Solution Approach

### Data Structure
Cart items are stored in a JavaScript array (`cartItems`). Each item contains:
- Unique ID (timestamp-based)
- Name, price, image URL, description
- Order limit (maximum quantity allowed)
- Current quantity in cart

### Key Implementation Details

1. **Dynamic Rendering**: Cart items are dynamically generated and rendered using JavaScript. When any change occurs, the entire cart re-renders to reflect updates.

2. **Event Delegation**: Instead of attaching event listeners to each button individually, a single listener on the parent element handles all clicks using `data-action` attributes. This works for dynamically created buttons.

3. **Price Calculation Logic**:
   - Subtotal = sum of (item price × quantity) for all items
   - Discount calculated based on promo code type:
     - Percentage: `(subtotal × percentage) / 100`
     - Fixed: Deducted from subtotal (or shipping for FREESHIP)
   - Total = (Subtotal - Discount) + Shipping

4. **Order Limit Validation**: Before incrementing quantity, the system checks if it would exceed the item's order limit. If so, a popup warning appears.

5. **Modal System**: Uses HTML5 `popover` API for lightweight modals without external libraries.

## 💻 Technical Overview

### Core Functions
- `renderCartItems()` - Displays all cart items
- `calculateTotals()` - Calculates prices and discounts
- `updateItemQuantity()` - Handles quantity changes with limit validation
- `createItem()` / `updateItem()` / `deleteItem()` - CRUD operations

### Price Calculation
```
Total = (Subtotal - Discount) + Shipping
```

### Technology
- Vanilla JavaScript (ES6+)
- Tailwind CSS (via CDN)
- HTML5 Popover API for modals

## ✅ What Was Accomplished

This solution successfully implements a complete shopping cart management system that:

- ✅ Handles all CRUD operations (Create, Read, Update, Delete) for cart items
- ✅ Manages item quantities with proper validation and order limits
- ✅ Calculates prices accurately including discounts and shipping
- ✅ Provides a flexible promo code system supporting multiple discount types
- ✅ Offers an intuitive, responsive user interface
- ✅ Uses modern web technologies without external dependencies
- ✅ Demonstrates proper JavaScript patterns (event delegation, state management)

The code is clean, well-organized, and easy to understand. All functionality works as expected with proper error handling and user feedback.

---

**Cart Management Solution** - Complete shopping cart with CRUD operations and promo code system.
# ITS-Cart-management
