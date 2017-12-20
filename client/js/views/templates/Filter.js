module.exports = ( { filter, data } ) => {
    data = filter.minMax ? [ ] : data

    const inputs = filter.minMax
        ? `<div class="form-group">
              <input type="text" placeholder="Min" />
          </div>
          <div class="form-group">
              <input type="text" placeholder="Max" />
          </div>
          <button type="button" data-js="minMaxBtn">Go</button>`
        : ``

    const checkboxes = data.length ? data.map( datum => {
        const dataAttr = filter.fk
            ? `data-id="${datum._id}"`
            : `data-name="${datum.name}"`

        return `` +
        `<li>
            <label>
                <input ${dataAttr} type="checkbox" />
                <span>${datum.label}</span>
            </label>
        </li>`
    } ).join('') : ``

return `` +
`<div data-name="${filter.name}" class="filter">
    <div>${filter.label}</div>
    <ul class="filters">${checkboxes}${inputs}</ul>
</div>`
}