module.exports = p => {
    const dataAttr = p.fk ? 'id' : 'name'

    const checkboxes = p.data.map( datum =>
        `<li>
            <label>
                <input data-${dataAttr}="${datum[ dataAttr === 'id' ? '_id' : dataAttr ]}" type="checkbox" />
                <span>${datum.label}</span>
            </label>
        </li>`
    ).join('')

return `` +
`<div data-name="${p.name}" class="filter">
    <div>${p.label}</div>
    <ul class="filters">${checkboxes}</ul>
</div>`
}