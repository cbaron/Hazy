module.exports = ( { opts } ) =>
`<section>
    <p>${opts.message}</p>
    <div class="side-by-side">
       <button data-js="submitBtn" class="btn">Delete</button>
       <button data-js="cancelBtn" class="btn">Cancel</button>
    </div>
</section>`
