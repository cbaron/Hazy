module.exports = ( { datum, ImageSrc, Currency } ) =>
`<div class="checkout-item">
    <div><img src="${ImageSrc(datum.PhotoUrls[0])}" /></div>
    <div>${datum.label}</div>
    <div>Type: ${datum.DiscType}</div>
    <div>Weight: ${datum.weight}g</div>
    <div class="price">${Currency.format( datum.price )}</div>
</div>`