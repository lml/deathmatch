Marionette = require 'marionette'
ContentEditable = require '../behaviors/content_editable.js.coffee'

class Part extends Marionette.LayoutView

  id: () ->
    "part-#{@model.get('position')}-container"

  tagName: 'li'
  className: 'has-drawer'
  template: '#part-template'

  regions:
    content: '.js-part-background-container'
    questions: '.js-part-questions-container'

  behaviors: () ->
    self = this
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add background information for this part.'
        edit: 'Click to edit background information for this part.'
      contentRegion: self.content
      loadContent: () -> self.model.background
      saveChanges: (content) ->
        self.model.background = content
        self.model.save()

module.exports = Part
