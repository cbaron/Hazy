module.exports = function( p ) {
    const selectCaret = p.GetIcon( 'caret-down', { name: 'caret' } )
    return `` +
`<section>
    <h1 data-js="heading">Waiting List Swap</h1>
    <div data-js="content" class="side-by-side hidden content">
        <div>
            <div data-view="typeAhead"></div>
            <div class="waiting-list">
                <label>Waiting List</label>
                <div>
                    <div class="select-wrap">
                        <select data-js="waitingList"></select>
                        ${selectCaret}
                    </div>
                    <div data-view="divisionDropdown"></div>
                </div>
            </div>
        </div>
        <div class="action">
            <p data-js="explanation"></p>
            <div data-view="buttonFlow"></div>
        </div>
    </div>
</section>`
}
