const Form = require('./Form'),
    attributes = require('../../../../models/GiftCardRecipient').attributes

module.exports = p => {
    const fields = p.GetFormFields( attributes )

    const recipients = [ ...new Array(4) ].map( ( item, i ) =>
        `<div class="form-group">
            <label>Recipient ${i+1}</label>
            <section class="Form"
                <div class="form-box">
                    <form>${fields}</form>
                </div>
            </section>
        </div>`
    ).join('')

return `` +
`<div class="form-group">
    <label>Recipients</label>
    <section class="Form"
        <div class="form-box">
            <form>${recipients}</form>
        </div>
    </section>
</div>`
}


