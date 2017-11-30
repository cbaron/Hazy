module.exports = ( { model, ImageSrc } ) =>  {
/*
const logos = model.map( item => `<li><img src="/static/img/${item}-logo.jpg"/></li>` ).join('')
<div class="side-by-side">
    <div class="featured-product">
        <span class="title">Featured Item</span>
        <img src="/static/img/putt-closeup.jpg" />
    </div>
    <div class="featured-product">
        <span class="title">Featured Item</span>
        <img src="/static/img/putt-ahead.jpg" />
    </div>
</div>
<div class="disc-doctor">
        <div class="main">
            <div>
                <div>${require('./lib/logoWhite')()}</div>
                <div class="heading">Disc Doctor</div>
                <div class="subtitle">
                    <div>New to disc golf?</div>
                    <div>Find the perfect disc with out interactive guide.</div>
                </div>
            </div>
            <div></div>
        </div>
    </div>
    <div class="side-by-side">
        <div class="ezFinder">
            <span class="title">E-Z Finder</span>
            <span class="caption">An enlightened search experience awaits you...</span>
        </div>
        <div class="featured-product">
            <span class="title">Featured Item</span>
            <img src="/static/img/basket-close.jpg" />
        </div>
    </div>
<div class="suppliers">
        <div>We are proud to carry the best names in disc golf</div>
        <ul class="logos">${logos}</ul>
    </div>
*/
return `` +
`<div>
    <div>
        <div data-js="headerImage"></div>
        <div class="overlay hidden side-by-side">
            <div><img src="${ImageSrc('logo-white-discgolf.png')}"/></div>
            <div>
                <p>Proud to be the Miami Valley's premiere supplier of disc golf gear and accessories since 2002.</p>
                <button type="button">Visit Our Stores</button>
            </div>
        </div>
    </div>
    <div>
        <div data-js="giftCardBgImage"></div>
        <div class="overlay hidden side-by-side">  
            <div class="featured">
                <div>Holiday</div>
                <div>Gift Cards</div>
                <div>
                    <button data-js="giftCardBtn" type="button">Buy Now</button>
                </div>
            </div>
            <div><img src="${ImageSrc('gift-cards.png')}"/></div>
        </div>
    </div>
    <div>
        <div data-js="byopImage"></div>
        <div class="overlay hidden side-by-side">
            <div>
                <div class="featured">2017 Results</div>
                <div>Where did you place?</div>
                <div>
                    <button data-js="byopResultsBtn" type="button">See Results</button>
                </div>
            </div>
        </div>
    </div>
</div>` }