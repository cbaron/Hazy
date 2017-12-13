module.exports = p =>
`<div class="cart-item side-by-side">
    <div><img src="${p.ImageSrc(p.PhotoUrls[0])}" /></div>
    <div>
        <div>${p.DiscType}</div>
        <div>${p.DiscClass}</div>
        <button data-js="deleteBtn" type="button">Delete</button>
    </div>
    <div class="form-group"><input type="text" data-js="itemQuantity" value="${p.quantity || '1'}" /></div>
    <div class="price">${p.Currency.format( p.price ) || '$0.00'}</div>
</div>`