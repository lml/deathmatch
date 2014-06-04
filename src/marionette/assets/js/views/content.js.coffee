Marionette = require 'marionette'

Editor = require './editor.js.coffee'
Viewer = require './viewer.js.coffee'
Prompter = require './prompter.js.coffee'

class Content extends Marionette.LayoutView

  template: "#content-template"

  regions:
    editor: '.js-editor-container'
    viewer: '.js-viewer-container'
    prompter: '.js-prompter-container'

  onShow: () ->
    @editorView = new Editor()
    @viewerView = new Viewer()
    @prompterView = new Prompter @options.prompts
    @listenTo @editorView, 'content:save', () -> @triggerMethod('content:save')
    @listenTo @editorView, 'content:cancel', () -> @triggerMethod('content:cancel')
    @listenTo @viewerView, 'content:edit', () -> @triggerMethod('content:edit')
    @listenTo @prompterView, 'content:edit', () -> @triggerMethod('content:edit')
    @editor.show @editorView
    @viewer.show @viewerView
    @prompter.show @prompterView

  onContentChanged: (content) ->
    @editorView?.triggerMethod 'content:changed', content
    @viewerView?.triggerMethod 'content:changed', content
    @prompterView?.triggerMethod 'content:changed', content

  onModeChanged: (content, mode) ->
    @onContentChanged content

  editorContent: () ->
    @editorView?.getContent()

module.exports = Content
