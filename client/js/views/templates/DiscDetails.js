module.exports = ( { discModel, discTypeModel, ImageSrc, Currency } ) => {
    const thumbnails = discModel.PhotoUrls.map( url => `<li><img src="${ImageSrc( url )}" /></li>` ).join('')

return `` +
`<div class="disc-details">
    <div>
        <div>${discModel.label}</div>
        <div data-js="manufacturer">by ${discTypeModel.Manufacturer}</div>
    </div>
    <div class="side-by-side">
        <div class="image-viewer">
            <div><img data-js="displayedImage" src="${ImageSrc( discModel.PhotoUrls[0] )}" /></div>
            <ul data-js="thumbnails" class="side-by-side">${thumbnails}</ul>
        </div>
        <div>
            <div>${discTypeModel.label}</div>
            <div>Weight: ${discModel.weight}g</div>
        </div>
        <div>
            <div>Price: ${Currency.format( discModel.price )}</div>
            <div><button data-js="addToCartBtn" type="button">Add To Cart</button></div>
        </div>
    </div>
    <div>
        <h4>Product description</h4>        
        <div>${discTypeModel.description}</div>
    </div>
</div>`
}