module.exports = p => {
    const heading = p.opts.heading ? `<div class="heading">${p.opts.heading}</div>` : ``,
        deleteBtn = p.opts.delete ? `<div data-js="deleteBtn" class="hidden delete">${p.GetIcon('garbage')}</div>` : ``,
        prompt  = p.opts.prompt ?  `<div class="prompt">${p.opts.prompt}</div>` : ``,
        fields = p.GetFormFields( p.attributes, p.model, p.meta ),
        total = p.opts.displayTotal
            ? `<div class="total"><span>Total: </span><span data-js="total">${p.Currency.format( p.model.total )}</span></div>`
            : ``,
        buttonRow = p.opts.hideButtonRow
            ? ``
            : `<div class="btn-row">
                <button data-js="submitBtn" type="button">
                    <span>${p.opts.submitText || 'Submit'}</span>
                </button>
                <button data-js="cancelBtn" type="button">
                    <span>${p.opts.cancelText || 'Cancel'}</span>
                </button>
            </div>`

return `<section>
    ${heading}
    <div class="form-box">
        ${prompt}
        <form>${fields}</form>
        ${total}
        ${buttonRow}
        ${deleteBtn}
    </div>
</section>`
}
