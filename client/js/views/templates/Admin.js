module.exports = ( { user, ImageSrc } ) =>
`<div>
    <div class="splash" data-js="splash">
        <div data-js="column0"></div>
        <img src="${ImageSrc('hazy-tree.svg')}"/>
        <div data-js="column1"></div>
    </div>
    <div class="views" data-js="views"></div>
</div>`
