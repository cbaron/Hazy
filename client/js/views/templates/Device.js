module.exports = p => {
    const options = p.GetSelectOptions( p.actionData, null, { valueAttr: 'name' } )

return `` +
`<div class="device side-by-side">
    <div>${p.label}</div>
    <select data-js="action">
        <option selected disabled>Choose Action</option>
        ${options}
    </select>
    ${p.GetIcon('caret-down')}
</div>`
}