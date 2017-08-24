module.exports = p => {
    const heading = p.opts.heading ? `<div class="heading">${p.opts.heading}</div>` : ``,
       prompt  = p.opts.prompt ?  `<div class="prompt">${p.opts.prompt}</div>` : ``,
       fields = p.GetFormFields( p.attributes, true )

return `<section>
    ${heading}
    <div class="form-box">
        ${prompt}
        <form>${fields}</form>
        <div class="btn-row">
            <button data-js="submitBtn" type="button">
                <span>${p.opts.submitText || 'Submit'}</span>
            </button>
        </div>
    </div>
</section>`
}