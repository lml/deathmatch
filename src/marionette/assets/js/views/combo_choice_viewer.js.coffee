Marionette = require 'marionette'
_ = require 'underscore'

class ComboChoiceViewer extends Marionette.ItemView

  className: 'js-combo-choice-viewer-container'
  template: '#combo-choice-viewer-template'

  serializeData: () ->
    combos = @model.combos()
    if combos.length > 0
      txt = _.initial(combos).join ', '
      if combos.length > 1
        txt += ' & '
      txt += _.last(combos)
      choiceText: txt
    else
      choiceText: "Invalid selections. Please edit to fix."

module.exports = ComboChoiceViewer
