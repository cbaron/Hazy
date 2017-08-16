module.exports = ( p ) => `<section>
    <div class="left-panel" data-js="leftPanel">
        <section>
            <button class="back-btn" data-js="goBackBtn">${require('./lib/leftArrow')()}<span>Back to Admin</span></button>
        </section>
        <section>
            <div data-js="resource"></div>
        </section>
        <section>
            <div class="side-by-side" data-js="collectionsDropDownBtn">
                ${require('./lib/caret-down')( { name: 'collectionCaret' } )}
                <span>Collections</span>
            </div>
            <div data-view="list" data-name="collections" />
            <button class="link">
                <span>+</span>
                <span>Create Collection</span>
            </button>
        </section>
    </div>
    <div data-view="list" data-name="discTypesList"></div>
    <div data-view="list" data-name="discTypeJson"></div>
    <button class="floating" data-js="addButton">Add</button>
</section>`
