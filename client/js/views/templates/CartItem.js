module.exports = ( { datum, ImageSrc, Currency } ) =>
`<div class="cart-item side-by-side">
    <div><img src="${datum.PhotoUrls[0]}" /></div>
    <div>
        <div>${datum.DiscType}</div>
        <div>Weight: ${datum.weight}g</div>
        <div>Color: ${datum.color}</div>
        <button data-js="deleteBtn" type="button">Delete</button>
    </div>
    <div class="form-group"><input type="text" data-js="itemQuantity" value="${datum.quantity || '1'}" /></div>
    <div class="price">${Currency.format( datum.price )}</div>
</div>`