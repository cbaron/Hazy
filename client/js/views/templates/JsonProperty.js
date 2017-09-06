module.exports = ( { viewName, isEditable, model } ) =>
`<div class="${isEditable ? 'editable' : ''}">
    <div data-view="buttonFlow"></div>
    <div data-js="key" contenteditable="${isEditable}">${model.key}</div>
    <div data-view="${viewName}"></div>
</div>`
