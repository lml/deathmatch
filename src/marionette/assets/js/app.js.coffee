ExerciseEditor = require './entities/_namespace.js.coffee'
require './entities/combo_choices.js.coffee'
require './entities/question.js.coffee'
require './entities/exercise.js.coffee'

PartsView = require './apps/editor/part.js.coffee'
ExerciseEditor.Behaviors = {}
ExerciseEditor.Behaviors.ContentEditable = require './apps/editor/content_editable.js.coffee'

Marionette = require 'marionette'

Marionette.Behaviors.behaviorsLookup = () -> ExerciseEditor.Behaviors

ExerciseEditor.App = new Marionette.Application

ExerciseEditor.App.addRegions
  exerciseRegion: "#exercise-content"

ExerciseEditor.App.on "start", () ->
  partsView = new PartsView()
  ExerciseEditor.App.exerciseRegion.show(partsView)

ExerciseEditor.App.start()
