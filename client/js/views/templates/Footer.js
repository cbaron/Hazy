module.exports = p =>
`<footer>
    <div data-js="footerImage"></div>
    <div class="overlay hidden">
        <div>
            <img src="${p.ImageSrc('logo-white-discgolf.png')}"/>
            <div class="contact">
                <div>Hazy Shade Disc Golf</div>
                <div>723 Watervliet Ave</div>
                <div>Dayton, OH 45420</div>
                <div>2113 Park Rd</div>
                <div>Springfield, OH 45504</div>
                <div>(937) 256-2690</div>
                <div>sales@hazyshade.com</div>
                <div>Mon &ndash; Sat 11am &ndash; 8pm</div>
                <div>Sun 12pm &ndash; 7pm</div>
                <a href="https://www.facebook.com/Hazy-Shade-Disc-Golf-And-More-173084619405424" target="_blank">${require('./lib/facebook')()}</a>
            </div>
        </div>
    </div>
</footer>`