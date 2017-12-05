module.exports = p =>
`<div>
    <div>
        <img data-src="${p.ImageSrc('gift-cards.png')}"/>
    </div>
    <div class="content">
        <div>
            <h4>Purchase Gift Cards</h4>
            <p>Share your disc golf joy by purchasing a Hazy Shade gift card for your friends, family, and loved ones!</p>
        </div>
        <div>
            <div data-view="form" data-name="giftCardTransaction"></div>
        </div>
    </div>
</div>`