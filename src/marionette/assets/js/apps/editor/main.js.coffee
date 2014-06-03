# Only one piece of content can be edited at a time.
# Automatically persist unsaved content (TODO: #versions, #undo)
Marionette = require 'marionette'
require '../entities/_namespace.js.coffee'
_ = require 'underscore'
$ = require 'jquery'
require './content_editable.js.coffee'
