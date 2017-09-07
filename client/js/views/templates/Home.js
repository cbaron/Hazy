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

return `<div>
    <img src="${ImageSrc('saugatuck-basket-on-right.jpg')}"/>
    <div class="intro side-by-side">
        <div>
            ${require('./lib/logoBlack')()}
        </div>
        <div>
            <h3>Taking Disc Golf to a Whole New Level</h3>
            <p>At Hazy Shade, disc golf is more than just a game...it's an obsession.  That's why since 2002, we've supplied the Miami Valley with the latest in disc golf gear and technology.</p>
            <p>We also sponsor a number of tournaments and outings thoughout the year.  Become a Hazy Shader today to get the scoop on all the latest disc golf action!</p>
        </div>        
    </div>
    <!--<div class="side-by-side">
        <div data-js="ezFinder" class="ez-finder">
            <span class="title">E-Z Finder</span>
            <span class="caption">An enlightened search experience awaits you...</span>
            <img src="${ImageSrc('ez-finder.png')}" />
        </div>
        <div class="featured-product">
            <span class="title">Featured Item</span>
            <img src="${ImageSrc('hazy-tree.png')}" />
        </div>
    </div>-->
    <div class="featured-event">
        <img src="${ImageSrc('discs-in-basket.jpg')}"/>
        <div class="content">
            <div class="center">
                <div>Please be patient while we build our online shop</div>
            </div>
        </div>
    </div>
</div>` }
