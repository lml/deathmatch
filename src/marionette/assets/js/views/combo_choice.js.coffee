Marionette = require 'marionette'
ComboChoiceViewer = require './combo_choice_viewer.js.coffee'
ComboChoiceEditor = require './combo_choice_editor.js.coffee'

class ComboChoice extends Marionette.LayoutView

  className: 'js-combo-choice-container'
  template: '#combo-choice-container-template'

  regions:
    viewer: '.js-combo-viewer-container'
    editor: '.js-combo-editor-container'

  onShow: () ->
    @viewer.show(new ComboChoiceViewer model: @model)
    @editor.show(new ComboChoiceEditor model: @model)

module.exports = ComboChoice
