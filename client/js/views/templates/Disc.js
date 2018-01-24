module.exports = ( { datum, typeDatum, ImageSrc, Currency } ) =>
`<div class="disc-overview">
    <div class="side-by-side">
        <div><img src="${datum.PhotoUrls[0]}"/></div>
        <div>
            <div>${typeDatum.Vendor} ${typeDatum.PlasticType} ${typeDatum.label}</div>
            <div>${datum.weight}</div>
            <div>${datum.color}</div>
            <div>${datum.plh}</div>
            <div>${Currency.format( datum.price )}</div>
        </div>
        <div>
            <button type="button" data-js="discDetailsBtn">See Details</button>
            <button type="button" data-js="addToCartBtn">Add To Cart</button>
        </div>
    </div>
</div>`