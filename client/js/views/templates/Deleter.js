module.exports = ( { opts } ) =>
`<section>
    <div data-js="deletion">
        ${opts.message}
        <div class="side-by-side">
           <button data-js="submitBtn" class="btn">Delete</button>
           <button data-js="cancelBtn" class="btn">Cancel</button>
        </div>
    </div>
    <div class="hidden" data-js="constraintInfo">
        <div>This document is referenced by other collections. Before deleting, you must update or delete the relevant documents of the following collections:</div>
        <ul data-js="fkReferences"></ul>
        <div><button data-js="okBtn" type="button">OK</button></div>
    <div>
</section>`
