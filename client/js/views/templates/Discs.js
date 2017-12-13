module.exports = p =>
`<div>
    <div><img data-src="${p.ImageSrc('header-image.jpg')}"/></div>
    <div data-js="inventory" class="inventory">
        <div data-js="leftPanel" class="left-panel">
            <h4>Filter by</h4>
            <div data-js="filters"></div>
        </div>
        <div class="main-panel">
            <div data-view="list" data-name="productResults"></div>
        </div>
    </div>
</div>`