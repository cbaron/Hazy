const getHeading = ( p ) => {
    return p.opts.goBack
    ? `<div class="heading">
        <button class="back-btn" data-js="goBackBtn">
            ${require('./lib/leftArrow')()}
            <span>${p.opts.goBack}</span>
        </button>
        <h3>${p.opts.name}</h3>
      </div>`
    : p.opts.toggle
        ? `<div data-js="toggle" class="heading side-by-side toggle">
            ${p.GetIcon('caret-down')}
            <span>${p.opts.name}</span>
          </div>`
        : `<h3>${p.opts.name}</h3>`
}

module.exports = function( p ) {
return `` +
`<section class="${p.opts.name || ''}">
    ${getHeading(p)}
    <ol data-js="list" class="list ${p.model.draggable ? 'no-select' : '' }"></ol>
    ${p.model.reset ? `<button class="floating" data-js="resetBtn">Reset</button>` : ``}
    ${p.model.save ? `<button class="floating" data-js="saveBtn">Save</button>` : ``}
</section>`
}
