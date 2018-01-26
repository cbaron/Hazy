module.exports = ( { datum, ImageSrc, Currency } ) => {
    const flight = datum.flight
        ? `<ul>Flight Stats
            <li>Speed: ${datum.flight.speed}</li>
            <li>Fade: ${datum.flight.fade}</li>
            <li>Glide: ${datum.flight.glide}</li>
            <li>Turn: ${datum.flight.turn}</li>
          </ul>`
        : ``

return `` +
`<div class="disc-type">
    <img src="${datum._Disc[0].PhotoUrls[0]}" />
    <div>${datum.Vendor} ${datum.PlasticType} ${datum.label}</div>
    <div>Class: ${datum.DiscClass}</div>
    <div>${flight}</div>
    <div>${Currency.format( datum.price )} (${datum._Disc.length} in stock)</div>
    <button data-js="seeDiscsBtn" type="button">See Discs</button>
</div>`
}