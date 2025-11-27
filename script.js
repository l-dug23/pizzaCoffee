document.addEventListener("DOMContentLoaded", () => {

    // --- Quantity Buttons ---
    const plusButtons = document.querySelectorAll(".qty-btn-plus");
    const minusButtons = document.querySelectorAll(".qty-btn-minus");

    plusButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector(".qty-input");
            input.value = Number(input.value) + 1;
        });
    });

    minusButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector(".qty-input");
            if (input.value > 0) input.value = Number(input.value) - 1;
        });
    });

    // ----- CART SYSTEM -----
    let cart = JSON.parse(localStorage.getItem("cart")) || {};

    const addButtons = document.querySelectorAll(".add-to-cart");

    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest("li");

            const name = item.querySelector("span").innerText;
            const price = Number(item.querySelector(".price").innerText.replace("£", ""));
            const qty = Number(item.querySelector(".qty-input").value);

            if (qty === 0) return;

            if (!cart[name]) {
                cart[name] = { qty: qty, price: price };
            } else {
                cart[name].qty += qty;
            }

            item.querySelector(".qty-input").value = 0;

            saveCart();
            updateCartCount();
        });
    });

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        let totalQty = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
        cartCount.innerText = totalQty;
    }

    updateCartCount();

    // --- CART PANEL OPEN/CLOSE ---
    const cartIcon = document.querySelector(".cart");
    const cartPanel = document.getElementById("cart-panel");
    const cartOverlay = document.getElementById("cart-overlay");
    const closeCartBtn = document.getElementById("close-cart");

    cartIcon.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    function openCart() {
        renderCart();
        cartPanel.classList.add("show");
        cartOverlay.classList.remove("hidden");
    }

    function closeCart() {
        cartPanel.classList.remove("show");
        cartOverlay.classList.add("hidden");
    }

    // --- RENDER CART ITEMS ---
    function renderCart() {
        const cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = "";

        let totalPrice = 0;

        for (let name in cart) {
            const item = cart[name];
            totalPrice += item.qty * item.price;

            const li = document.createElement("li");
            li.innerHTML = `
                ${name} x ${item.qty} — £${(item.qty * item.price).toFixed(2)}
                <button class="remove-btn" data-name="${name}">X</button>
            `;
            cartItems.appendChild(li);
        }

        document.getElementById("cart-total-price").innerText = totalPrice.toFixed(2);

        const removeBtns = document.querySelectorAll(".remove-btn");
        removeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.dataset.name;
                delete cart[name];
                saveCart();
                updateCartCount();
                renderCart();
            });
        });
    }

    // --- CHECKOUT BUTTON (EMAIL ORDER) ---
    const checkoutBtn = document.getElementById("checkout-btn");

    checkoutBtn.addEventListener("click", () => {

        let message = "New Order:\n\n";
        let total = 0;

        for (let item in cart) {
            let qty = cart[item].qty;
            let price = cart[item].price;
            let subtotal = qty * price;

            total += subtotal;

            message += `${item} — Qty: ${qty} — £${subtotal.toFixed(2)}\n`;
        }

        message += `\nTOTAL: £${total.toFixed(2)}\n`;

        // Put order text into hidden form field
        document.getElementById("order-data").value = message;

        // Submit the hidden form
        document.getElementById("order-form").submit();

        // Clear cart
        cart = {};
        localStorage.removeItem("cart");
        updateCartCount();
        closeCart();
    });

});
