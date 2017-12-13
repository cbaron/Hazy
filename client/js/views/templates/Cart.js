module.exports = p =>
`<div>
    <h2>Shopping Cart</h2>
    <ul class="side-by-side">
        <li>Product</li>
        <li>Quantity</li>
        <li>Item Price</li>
    </ul>
    <div data-view="list" data-name="cartContents"></div>
    <div>
        <div class="subtotal">
            <span>Subtotal</span>
            <span data-js="itemCount"></span>
            <span data-js="subtotal"></span>
        </div>
        <div><button data-js="checkoutBtn" type="button">Proceed to Checkout</button></div>
    </div>
</div>`