module.exports = p =>
`<div class="${p.opts.hideSearch ? 'hiding-search' : ''}">
    <input data-js="input" placeholder="${p.opts.placeholder || ''}" "type="text">
    ${p.opts.hideSearch ? '' : require('./lib/search')()}
</div>`
