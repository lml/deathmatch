ExerciseEditor = require './entities/_namespace.js.coffee'
require './entities/combo_choices.js.coffee'
require './entities/question.js.coffee'
require './entities/exercise.js.coffee'

Marionette = require 'marionette'

ExerciseEditor.App = new Marionette.Application

ExerciseEditor.App.on "start", () ->
  console.log "Hello world!"


ExerciseEditor.App.start()
