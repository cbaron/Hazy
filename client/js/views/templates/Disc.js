module.exports = ( { datum, typeDatum, ImageSrc, Currency } ) =>
`<div class="disc-overview">
    <div class="side-by-side">
        <div><img src="${datum.PhotoUrls[0]}"/></div>
        <div>
            <div>${typeDatum.Vendor} ${typeDatum.PlasticType} ${typeDatum.label}</div>
            <div>Weight: ${datum.weight}g</div>
            <div>Color: ${datum.color}</div>
            <div>PLH: ${datum.plh}</div>
            <div>${Currency.format( datum.price )}</div>
        </div>
        <div>
            <button type="button" data-js="discDetailsBtn">See Details</button>
            <button type="button" data-js="addToCartBtn">Add To Cart</button>
        </div>
    </div>
</div>`