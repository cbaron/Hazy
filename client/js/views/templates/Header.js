module.exports = p => {
//const spans = model.map( item => `<li><span data-js="item">${item}</span></li>` ).join('')
        //<li><ul class="spans">${spans}</ul></li>
return `` +
`<nav>
    <ul class="nav">
        <li>${p.GetIcon( 'logoWhite', { name: 'logo' } )}</li>
        <li data-js="typeAhead"></li>
        <li data-js="shopBtn">Shop</li>
        <li class="side-by-side">
            <span>${p.GetIcon('shoppingCart')}</span>
            <span data-js="cartCount">(0)</span>
        </li>
        <li data-js="profileBtn" class="hidden">
            ${p.GetIcon('profile')}
            <ul>
                <li data-js="name"></li>
                <li data-js="logout">Logout</li>
            </ul>
        </li>
    </ul>
</nav>`
}
