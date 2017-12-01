module.exports = ( { name, data } ) => {
    const tableRows = data ? data.map( ( team, i ) =>
        `<li>
            <span class="place">${i + 1}</span>
            <span class="team">${team.player1}, ${team.player2}</span>
            <span class="round1">${team.rd1}</span>
            <span class="round2">${team.rd2}</span>
            <span class="total">${team.final}</span>
        </li>`
    ).join('') : `<li><span>No Results.</span></li>`

return `` +
`<div class="division-result">
    <h4>${name}${data && data.length ? `<span>(${data.length})</span>` : ``}</h4>
    <ol class="header">
        <li>
            <span class="place">Place</span>
            <span class="team">Team</span>
            <span class="round1">Round 1</span>
            <span class="round2">Round 2</span>
            <span class="total">Total</span>
        </li>
    </ol>
    <ol>${tableRows}</ol>
</div>`
}