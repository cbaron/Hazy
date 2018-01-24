module.exports = p =>
`<div>
    <div data-js="inventory" class="inventory">
        <div data-js="leftPanel" class="left-panel">
            <h4>Filter by</h4>
            <div data-js="filters"></div>
        </div>
        <div class="main-panel">
            <div data-view="typeAhead"></div>
            <div data-view="list" data-name="discTypes"></div>
            <div class="hidden" data-view="list" data-name="availableDiscs"></div>
            <div class="hidden" data-view="productDetails"></div>
            <div class="hidden" data-view="cartAddition"></div>
        </div>
    </div>
</div>`