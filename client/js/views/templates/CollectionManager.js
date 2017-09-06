module.exports = ( p ) => `<section>
    <div class="left-panel" data-js="leftPanel">
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
    </div>
</section>`
