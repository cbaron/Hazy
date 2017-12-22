module.exports = ( { datum, ImageSrc, Currency } ) => {

return `` +
`<div class="disc">
    <img src="${ImageSrc(datum._Disc[0].PhotoUrls[0])}" />
    <div>${datum.label}</div>
    <div>${datum.DiscClass}</div>
    <div>${Currency.format( datum.price )}</div>
    <button data-js="seeDiscsBtn" type="button">See Discs</button>
</div>`
}