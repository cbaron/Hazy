module.exports = ( { model } ) => {
//const spans = model.map( item => `<li><span data-js="item">${item}</span></li>` ).join('')
        //<li><ul class="spans">${spans}</ul></li>
return `<nav>
    <ul class="nav">
        <li>${require('./lib/logoWhite')( { name: 'logo' } )}</li>
        <li data-js="typeAhead"></li>
        <li data-js="shopBtn">Shop</li>
        <li data-js="profileBtn" class="hidden">
            ${require('./lib/profile')('profile')}
            <ul>
                <li data-js="name"></li>
                <li data-js="logout">Logout</li>
            </ul>
        </li>
    </ul>
</nav>`
}
