Marionette = require 'marionette'
ContentEditable = require '../behaviors/content_editable.js.coffee'

class SimpleChoice extends Marionette.LayoutView

  className: 'js-simple-choice-container'
  template: '#simple-choice-template'

  regions:
    content: '.js-content-container'

  behaviors: () ->
    self = this
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add the choice content.'
        edit: 'Click to edit the choice content.'
      contentRegion: self.content
      loadContent: () -> self.model.content
      saveChanges: (content) ->
        self.model.content = content
        self.model.save()

module.exports = SimpleChoice
