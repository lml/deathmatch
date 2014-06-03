class PartEditor extends Marionette.ItemView

  tagName: 'li'

  template: '#part-template'

  triggers:
    'click @ui.prompter': 'content:edit'
    'click @ui.editButton': 'content:edit'

  ui:
    container: '.js-part-container'
    prompter: '.js-background-prompter'
    editButton: '.js-content-edit-button'

  behaviors:
    ContentEditable:
      tips:
        add: 'Click here to add background information for this part.'
        edit: 'Click to edit background information for this part.'
      editor:
        selector: '#background-editor'
        toolbar: '#background-editor-toolbar'
      loadContent: () -> @textContent
      saveContent: (content) -> @textContent = content

module.exports = PartEditor
