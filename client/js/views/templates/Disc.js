module.exports = p =>{
    //console.log( p )
return `` +
`<div class="disc">
    <img src="${p.ImageSrc(p.PhotoUrls[0])}" />
    <div>${p.DiscType}</div>
    <div>${p.DiscClass}</div>
    <button data-js="addToCartBtn" type="button">Add To Cart</button>
</div>`}