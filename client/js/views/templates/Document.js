module.exports = datum =>
    `<div class="DiscType">
        <span>${datum.label || datum.name || datum.createdAt}</span>
    </div>`
