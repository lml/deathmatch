Marionette = require 'marionette'

class Part extends Marionette.ItemView

  tagName: 'li'

  template: '#part-template'

  behaviors:
    ContentEditable:
      tips:
        add: 'Click here to add background information for this part.'
        edit: 'Click to edit background information for this part.'
      editor:
        selector: '#background-editor'
        toolbar: '#background-editor-toolbar'
        footer: '#background-editor-footer'
      loadContent: () -> @model.background
      saveChanges: (content) ->
        @model.background = content
        @model.save

module.exports = Part
