class PartEditor extends Marionette.ItemView

  tagName: 'li'

  template: '#part-template'

  triggers:
    'click @ui.prompter': 'content:edit'
    'click @ui.editButton': 'content:edit'
    'click @ui.saveButton': 'content:save'
    'click @ui.cancelButton': 'content:cancel'

  ui:
    container: '.js-part-container'
    prompter: '.js-background-prompter'
    viewer: '.js-background-viewer'
    editButton: '.js-content-edit-button'
    saveButton: '.js-content-save-button'
    cancelButton: '.js-content-cancel-button'

  behaviors:
    ContentEditable:
      tips:
        add: 'Click here to add background information for this part.'
        edit: 'Click to edit background information for this part.'
      editor:
        selector: '#background-editor'
        toolbar: '#background-editor-toolbar'
        footer: '#background-editor-footer'
      loadContent: () -> @textContent
      saveChanges: (content) -> @textContent = content

module.exports = PartEditor
