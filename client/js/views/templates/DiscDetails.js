module.exports = ( { discModel, discTypeModel, ImageSrc, Currency } ) => {
    const thumbnails = discModel.PhotoUrls.map( url => `<li><img src="${url}" /></li>` ).join(''),
        flight = discTypeModel.flight
            ? `<ul>Flight Stats
                <li>Speed: ${discTypeModel.flight.speed}</li>
                <li>Fade: ${discTypeModel.flight.fade}</li>
                <li>Glide: ${discTypeModel.flight.glide}</li>
                <li>Turn: ${discTypeModel.flight.turn}</li>
              </ul>`
            : ``

return `` +
`<div class="disc-details">
    <div>
        <div>${discTypeModel.label}</div>
    </div>
    <div class="side-by-side">
        <div class="image-viewer">
            <div><img data-js="displayedImage" src="${discModel.PhotoUrls[0]}" /></div>
            <ul data-js="thumbnails" class="side-by-side">${thumbnails}</ul>
        </div>
        <div>
            <div>${discTypeModel.Vendor} ${discTypeModel.PlasticType} ${discTypeModel.label}</div>
            <div>Weight: ${discModel.weight}g</div>
            <div>Color: ${discModel.color}</div>
            <div>PLH: ${discModel.plh}</div>
            <div>Plastic: ${discTypeModel.plasticType}</div>
            <div>Class: ${discTypeModel.DiscClass}</div>
            <div>${flight}</div>
        </div>
        <div>
            <div>Price: ${Currency.format( discModel.price || discTypeModel.price )}</div>
            <div><button data-js="addToCartBtn" type="button">Add To Cart</button></div>
        </div>
    </div>
    <div>
        <h4>Product description</h4>        
        <div>${discTypeModel.description}</div>
    </div>
</div>`
}