Marionette = require 'marionette'
#PartsView = require './parts.js.coffee'
ContentEditable = require '../behaviors/content_editable.js.coffee'

class Exercise extends Marionette.LayoutView

  id: 'exercise-container'
  className: 'has-drawer'
  template: '#exercise-template'

  regions:
    content: '.js-exercise-background-container'
    parts: '.js-exercise-parts-container'

  behaviors: () ->
    self = this
    ContentEditable:
      behaviorClass: ContentEditable
      prompts:
        add: 'Click here to add background information for the entire exercise.'
        edit: 'Click to edit background information for the entire exercise.'
      contentRegion: self.content
      loadContent: () -> self.model.background
      saveChanges: (content) ->
        self.model.background = content
        self.model.save

  # onShow: () ->
  #   @parts.show new PartsView
  #     collection: @model.get('parts')

module.exports = Exercise
