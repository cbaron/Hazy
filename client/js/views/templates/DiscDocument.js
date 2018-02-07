module.exports = p => {
    const weight = p.weight ? `${p.weight}g` : 'No weight'

return `` +
`<div class="composite-label side-by-side">
    <img src="${p.PhotoUrls[0]}" />
    <div>${p.discTypeLabel} &mdash; ${weight}</div>
</div>`
}