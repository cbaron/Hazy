module.exports = ( p ) => `<section>
    <div class="left-panel" data-js="leftPanel">
        <section>
            <button class="back-btn" data-js="goBackBtn">${require('./lib/leftArrow')()}<span>Back to Admin</span></button>
        </section>
        <section>
            <div data-js="resource"></div>
        </section>
        <section>
            <div data-view="list" data-name="collections"></div>
            <button data-js="createCollectionBtn" class="side-by-side link">
                <span>+</span>
                <span>Create Collection</span>
            </button>
        </section>
    </div>
    <div data-js="mainPanel" class="main-panel">
        <div class="hidden" data-view="list" data-name="documentView"></div>
        <div class="hidden" data-view="list" data-name="documentList"></div>
    </div>
    <button class="floating" data-js="addButton">Add</button>
</section>`
