Marionette = require 'marionette'

class Viewer extends Marionette.ItemView

  template: "#viewer-template"

  triggers:
    'click': 'content:edit'

  ui:
    content: '.js-viewer'

  onContentChanged: (html) ->
    @ui.content.html(html)

module.exports = Viewer
