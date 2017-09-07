module.exports = function(p) {
    const selectCaret = p.GetIcon( 'caret-down', { name: 'caret' } )
    return `` +
`<div class="select-wrap">
    <select data-js="division"></select>
    ${selectCaret}
</div>`
}
