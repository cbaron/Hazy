module.exports = p =>
`<section>
    <ol data-js="list" class="list"></ol>
    ${p.model.add ? `<button data-js="addBtn" type="button">${p.opts.addText || 'Add'}</button>` : ``}
</section>`