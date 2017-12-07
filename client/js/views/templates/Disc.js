module.exports = p =>
`<div class="disc">
    <img src="${p.ImageSrc(p.PhotoUrls[0])}" />
    <div>${p.DiscType}</div>
    <div>${p.DiscClass}</div>
    <div data-js="addToCartBtn">Add to Cart</div>
    <div data-js="addToWishListBtn">Add to Wish List</div>
    <div class="rating"></div>
    <button data-js="buyBtn" type="button">Buy It Now</button>
</div>`