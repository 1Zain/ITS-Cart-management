const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const shippingPriceElement = document.getElementById("shipping-price");
const popupElement = document.getElementById("popup");
const parentElement = document.querySelector("ul");
const addItemBtn = document.getElementById("add-item-btn");
const itemModal = document.getElementById("item-modal");
const itemForm = document.getElementById("item-form");
const deleteModal = document.getElementById("delete-modal");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const modalTitle = document.getElementById("modal-title");
// Promo Code
const promoCodeInput = document.getElementById("promo-code-input");
const applyPromoBtn = document.getElementById("apply-promo-btn");
const removePromoBtn = document.getElementById("remove-promo-btn");
const promoMessage = document.getElementById("promo-message");
const discountRow = document.getElementById("discount-row");
const discountAmount = document.getElementById("discount-amount");
const discountCodeBadge = document.getElementById("discount-code-badge");

let shippingPrice = 5000;
let orderLimit = 12;
let itemToDelete = null;
let itemToEdit = null;
let appliedPromoCode = null;

// Promo codes configuration
// type: 'percentage' or 'fixed'
// value: discount percentage (0-100) or fixed amount
const promoCodes = {
  'SAVE10': { type: 'percentage', value: 10, description: '10% off your order' },
  'SAVE20': { type: 'percentage', value: 20, description: '20% off your order' },
  'FREESHIP': { type: 'fixed', value: shippingPrice, description: 'Free shipping' },
  'FLAT50': { type: 'fixed', value: 5000, description: '$50 off your order' },
  'WELCOME': { type: 'percentage', value: 15, description: '15% off - Welcome discount' },
  'DEAL30': { type: 'percentage', value: 30, description: '30% off - Special deal' },
};

// Store cart items with their state
const cartItems = [];

const listItem = {
  id: Date.now(),
  name: "Nike Shoes",
  image: "https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-dunk-high-by-you-shoes.png",
  price: 10000,
  description: "",
  orderLimit: 10,
  quantity: 1,
};

const productList = [listItem, listItem, listItem];

// Calculate discount based on promo code
const calculateDiscount = (subtotalAmount) => {
  if (!appliedPromoCode) return 0;

  const promo = promoCodes[appliedPromoCode];
  if (!promo) return 0;

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = (subtotalAmount * promo.value) / 100;
  } else if (promo.type === 'fixed') {
    // For FREESHIP, discount is shown as shipping cost
    if (appliedPromoCode === 'FREESHIP') {
      discount = shippingPrice;
    } else {
      // For fixed amount, discount from subtotal
      discount = Math.min(promo.value, subtotalAmount);
    }
  }

  return Math.round(discount);
};

// Calculate total from all cart items
const calculateTotals = () => {
  const subtotalAmount = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  
  const discount = calculateDiscount(subtotalAmount);
  const finalShipping = appliedPromoCode === 'FREESHIP' ? 0 : shippingPrice;
  
  // Calculate total: for FREESHIP, discount is shipping, for others it's from subtotal
  let totalAmount;
  if (appliedPromoCode === 'FREESHIP') {
    totalAmount = subtotalAmount; // Shipping is free, no discount on subtotal
  } else {
    totalAmount = subtotalAmount - discount + finalShipping;
  }
  
  subtotal.innerText = "$" + subtotalAmount.toLocaleString();
  shippingPriceElement.innerText = "$" + finalShipping.toLocaleString();
  
  // Show/hide discount row
  if (appliedPromoCode && discount > 0) {
    discountRow.classList.remove("hidden");
    discountAmount.innerText = "-$" + discount.toLocaleString();
    discountCodeBadge.textContent = appliedPromoCode;
  } else {
    discountRow.classList.add("hidden");
  }
  
  total.innerText = "$" + totalAmount.toLocaleString();
};

// Render all cart items
const renderCartItems = () => {
  parentElement.innerHTML = "";
  
  cartItems.forEach((item) => {
    const createdListItem = document.createElement("li");
    createdListItem.setAttribute("data-item-id", item.id);

    createdListItem.innerHTML = `
      <div class="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
        <div class="shrink-0">
          <img
            class="h-24 w-24 max-w-full rounded-lg object-cover"
            src="${item.image}"
            alt="${item.name}"
          />
        </div>

        <div class="relative flex flex-1 flex-col justify-between">
          <div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
            <div class="pr-8 sm:pr-5">
              <p class="text-base font-semibold text-gray-900 item-name-display">
                ${item.name}
              </p>
              <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
                ${item.description || "36EU - 4US"}
              </p>
            </div>

            <div
              class="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end"
            >
              <p
                class="item-price-display shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right"
              >
                $${(item.price * item.quantity).toLocaleString()}
              </p>

              <div class="sm:order-1">
                <div
                  class="mx-auto flex h-8 items-stretch text-gray-600"
                >
                  <button
                    data-action="decrement"
                    class="decrement-btn flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                  >
                    -
                  </button>
                  <div
                    class="quantity-display flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition"
                  >
                    ${item.quantity}
                  </div>
                  <button
                    data-action="increment"
                    class="increment-btn flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            class="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto gap-2"
          >
            <button
              type="button"
              data-action="edit"
              class="edit-btn flex rounded p-2 text-center text-blue-500 transition-all duration-200 ease-in-out focus:shadow hover:text-blue-700"
              title="Edit item"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              data-action="delete"
              class="delete-btn flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-red-600"
              title="Delete item"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    parentElement.appendChild(createdListItem);
  });

  // Update totals after rendering
  calculateTotals();
};

// Create: Add new item to cart
const createItem = (itemData) => {
  const newItem = {
    id: Date.now(),
    name: itemData.name,
    price: parseFloat(itemData.price),
    image: itemData.image,
    description: itemData.description || "",
    orderLimit: parseInt(itemData.orderLimit) || 10,
    quantity: 1,
  };

  cartItems.push(newItem);
  renderCartItems();
  hideItemModal();
};

// Read: Already handled by renderCartItems()
// Update: Update item details
const updateItem = (itemId, itemData) => {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;

  cartItems[itemIndex] = {
    ...cartItems[itemIndex],
    name: itemData.name,
    price: parseFloat(itemData.price),
    image: itemData.image,
    description: itemData.description || "",
    orderLimit: parseInt(itemData.orderLimit) || 10,
  };

  renderCartItems();
  hideItemModal();
};

// Delete: Remove item from cart
const deleteItem = (itemId) => {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;

  cartItems.splice(itemIndex, 1);
  renderCartItems();
  hideDeleteModal();
};

// Update quantity for a specific item
const updateItemQuantity = (itemId, change) => {
  const item = cartItems.find(cartItem => cartItem.id === itemId);
  if (!item) return;

  if (item.quantity <= 0 && change < 0) {
    return;
  }

  // Check order limit
  if (item.quantity >= item.orderLimit && change > 0) {
    popupElement.showPopover();
    return;
  }

  // Update quantity
  item.quantity += change;

  // Re-render to show updated values
  renderCartItems();
};

// Modal functions
const showItemModal = (item = null) => {
  itemToEdit = item;
  if (item) {
    // Edit mode
    modalTitle.textContent = "Edit Item";
    document.getElementById("item-id-input").value = item.id;
    document.getElementById("item-name").value = item.name;
    document.getElementById("item-price").value = item.price;
    document.getElementById("item-image").value = item.image;
    document.getElementById("item-description").value = item.description || "";
    document.getElementById("item-order-limit").value = item.orderLimit;
  } else {
    // Create mode
    modalTitle.textContent = "Add New Item";
    document.getElementById("item-id-input").value = "";
    itemForm.reset();
  }
  itemModal.showPopover();
};

const hideItemModal = () => {
  itemModal.hidePopover();
  itemForm.reset();
  itemToEdit = null;
};

const showDeleteModal = (itemId) => {
  itemToDelete = itemId;
  deleteModal.showPopover();
};

const hideDeleteModal = () => {
  deleteModal.hidePopover();
  itemToDelete = null;
};

// Initialize cart with default items
for (let i = 0; i < productList.length; i++) {
  const productItem = productList[i];
  const itemId = productItem.id + i;
  
  cartItems.push({
    ...productItem,
    id: itemId,
    quantity: productItem.quantity
  });
}

// Event Listeners
addItemBtn.addEventListener("click", () => showItemModal());

itemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById("item-name").value,
    price: document.getElementById("item-price").value,
    image: document.getElementById("item-image").value,
    description: document.getElementById("item-description").value,
    orderLimit: document.getElementById("item-order-limit").value,
  };

  const itemId = document.getElementById("item-id-input").value;
  
  if (itemId) {
    // Update existing item
    updateItem(parseInt(itemId), formData);
  } else {
    // Create new item
    createItem(formData);
  }
});

confirmDeleteBtn.addEventListener("click", () => {
  if (itemToDelete) {
    deleteItem(itemToDelete);
  }
});

// Apply promo code
const applyPromoCode = () => {
  const code = promoCodeInput.value.trim().toUpperCase();
  
  if (!code) {
    showPromoMessage("Please enter a promo code", "error");
    return;
  }

  if (appliedPromoCode === code) {
    showPromoMessage("This promo code is already applied", "error");
    return;
  }

  if (promoCodes[code]) {
    appliedPromoCode = code;
    promoCodeInput.value = "";
    showPromoMessage(`Promo code "${code}" applied successfully! ${promoCodes[code].description}`, "success");
    calculateTotals();
  } else {
    showPromoMessage("Invalid promo code. Please try again.", "error");
  }
};

// Remove promo code
const removePromoCode = () => {
  appliedPromoCode = null;
  promoCodeInput.value = "";
  promoMessage.textContent = "";
  calculateTotals();
};

// Show promo code message
const showPromoMessage = (message, type) => {
  promoMessage.textContent = message;
  promoMessage.className = `mt-2 text-sm ${type === "success" ? "text-green-600" : "text-red-600"}`;
  
  // Clear message after 3 seconds
  setTimeout(() => {
    promoMessage.textContent = "";
  }, 3000);
};

// Event listeners for promo codes
applyPromoBtn.addEventListener("click", applyPromoCode);
removePromoBtn.addEventListener("click", removePromoCode);

// Allow Enter key to apply promo code
promoCodeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    applyPromoCode();
  }
});

// Use event delegation to handle clicks on dynamically created buttons
parentElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const listItem = event.target.closest("[data-item-id]");
  if (!listItem) return;

  const itemId = parseInt(listItem.getAttribute("data-item-id"));
  const action = button.getAttribute("data-action");

  if (action === "increment") {
    updateItemQuantity(itemId, 1);
  } else if (action === "decrement") {
    updateItemQuantity(itemId, -1);
  } else if (action === "delete") {
    showDeleteModal(itemId);
  } else if (action === "edit") {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      showItemModal(item);
    }
  }
});

// Hide popover function
const hidePopover = () => {
  if (popupElement) {
    popupElement.hidePopover();
  }
};

// Make functions available globally for onclick handlers
window.hidePopover = hidePopover;
window.hideItemModal = hideItemModal;
window.hideDeleteModal = hideDeleteModal;

// Add event listener for popup Ok button as backup (using event delegation)
document.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button && button.closest("#popup") && button.textContent.trim() === "Ok") {
    e.preventDefault();
    e.stopPropagation();
    hidePopover();
  }
});

// Initialize cart display
renderCartItems();
