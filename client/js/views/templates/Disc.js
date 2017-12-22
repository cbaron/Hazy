module.exports = ( { datum, typeDatum, ImageSrc, Currency } ) =>
`<div class="disc-overview">
    <div class="side-by-side">
        <div><img src="${ImageSrc( datum.PhotoUrls[0] )}"/></div>
        <div>
            <div>${datum.label}</div>
            <div>${typeDatum.Manufacturer}</div>
            <div>Weight: ${datum.weight}g</div>
            <div>${Currency.format( datum.price )}</div>
        </div>
        <div><button type="button" data-js="discDetailsBtn">See Details</button></div>
    </div>
</div>`