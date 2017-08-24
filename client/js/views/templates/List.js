const getHeading = ( opts ) => {
    return opts.goBack
    ? `<div class="heading">
        <button class="back-btn" data-js="goBackBtn">
            ${require('./lib/leftArrow')()}
            <span>${opts.goBack}</span>
        </button>
        <h3>${opts.heading}</h3>
      </div>`
    : opts.toggle
        ? `<div data-js="toggle" class="heading side-by-side">
            ${require('./lib/caret-down')()}
            <span>${opts.heading}</span>
          </div>`
        : `<h3>${opts.heading}</h3>`
}

module.exports = ( { model={}, opts={} } ) => {
return `` +
`<section class="${opts.name || ''}">
    ${getHeading(opts)}
    <ol data-js="list" class="${model.draggable ? 'no-select' : '' }"></ol>
    ${model.reset ? `<button class="floating" data-js="resetBtn">Reset</button>` : ``}
    ${model.save ? `<button class="floating" data-js="saveBtn">Save</button>` : ``}
</section>`
}