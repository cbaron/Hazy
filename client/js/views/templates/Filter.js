module.exports = p => {

    const checkboxes = p.data.map( datum =>
        `<li class="${datum.name}">
            <label>
                <input data-id="${datum._id}" type="checkbox" value="${datum._id}" />
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