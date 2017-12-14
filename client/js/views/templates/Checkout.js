module.exports = p => {
return `` +
`<div>
    <h2>Checkout</h2>
    <div>
        <div class="forms">
            <div data-view="form" data-name="storeTransaction"></div>
        </div>
        <div class="summary">
            <div>
                <h4>Order Summary</h4>
                <div data-view="list" data-name="cartContents"></div>
            </div>
        </div>
    </div>
</div>`
}