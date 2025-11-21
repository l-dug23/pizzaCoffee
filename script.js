/////////// run code after page has loaded //
document.addEventListener("DOMContentLoaded", () => {
    // add code in here //
    //create variable of all + - buttons //
    const plusButtons = document.querySelectorAll(".qty-btn-plus");
    const minusButtons = document.querySelectorAll(".qty-btn-minus");



    ///////////click behaviour of + - buttons //
    plusButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector(".qty-input");
            input.value = Number(input.value) + 1;
        });
    });
    minusButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const input = btn.parentElement.querySelector(".qty-input");
            if (input.value > 0) {
                input.value = Number(input.value) - 1;
            }
        });
    });

    /////// add to cart button ///
    // crate cart variable changable (let) //
    let cart = {};
    // get all add buttons //
    const addButtons = document.querySelectorAll(".add-to-cart");

    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const item = btn.closest("li");

            const name = item.querySelector("span").innerText;
            const priceText = item.querySelector(".price").innerText;
            const price = Number(priceText.replace("£", ""));
            const qty = Number(item.querySelector(".qty-input").value);

            // if ety is 0 do nothing//
            if (qty === 0) return;

            // Add or update item in cart object
            if (!cart[name]) {
                cart[name] = { qty: qty, price: price };
            } else {
                cart[name].qty += qty;
            }
            // Reset quantity to 0 //
            item.querySelector(".qty-input").value = 0;

            // Update cart header count
            updateCartCount();
        });
    });

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");
        let total = 0;

        for (let item in cart) {
            total += cart[item].qty;
        }

        cartCount.innerText = total;
    }
});