module.exports = ( { datum, ImageSrc, Currency, addToCart } ) => {
    const button = addToCart ? `<button data-js="addToCartBtn" type="button">Add To Cart</button>` : ``

return `` +
`<div class="disc">
    <img src="${ImageSrc(datum.PhotoUrls[0])}" />
    <div>${datum.DiscType}</div>
    <div>${datum.DiscClass}</div>
    <div>${Currency.format( datum.price )}</div>
    ${button}
</div>`
}