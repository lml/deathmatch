Marionette = require 'marionette'

class ChoiceActions extends Marionette.ItemView

  template: '#choice-actions-template'

  initialize: () ->
    @listenTo @model, 'change:position', @render

  templateHelpers: () ->
    letter: () =>
     @model.letter()


module.exports = ChoiceActions
