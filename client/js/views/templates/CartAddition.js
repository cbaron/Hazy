module.exports = p => 
`<div>
    <h4>Added to cart</h4>
    <div>
        <div>
            <div><img data-js="itemImage" src="" /></div>
            <div>
                <div data-js="label"></div>
                <div data-js="manufacturer"></div>
                <div data-js="price"></div>
            </div>
        </div>
        <div>
            <div data-js="subtotal"></div>
            <div data-js="cartCount"></div>
            <button data-js="viewCartBtn" type="button">View Cart and Checkout</button>
        </div>
    </div>
    <span class="close-btn" data-js="closeBtn"></span>
</div>`