module.exports = p => {
    const heading = p.opts.heading ? `<div class="heading">${p.opts.heading}</div>` : ``,
       prompt  = p.opts.prompt ?  `<div class="prompt">${p.opts.prompt}</div>` : ``,
       fields = p.GetFormFields( p.attributes, p.model ),
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
        ${buttonRow}  
    </div>
</section>`
}
