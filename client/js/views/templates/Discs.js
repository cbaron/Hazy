module.exports = p =>
`<div>
    <div data-js="ezFinder" class="ez-finder">
        <span class="title">E-Z Finder</span>
        <span class="caption">An enlightened search experience awaits you...</span>
        <img src="${p.ImageSrc('ez-finder.png')}" />
    </div>
    <div class="content">
        <div data-js="leftPanel" class="left-panel">
            <h4>Filter by</h4>
            <div data-js="filters"></div>
        </div>
        <div class="main-panel">
            <div class="inventory" data-js="inventory"></div>
        </div>
    </div>
</div>`