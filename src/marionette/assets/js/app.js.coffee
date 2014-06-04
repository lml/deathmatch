require './entities/combo_choices.js.coffee'
require './entities/question.js.coffee'
require './entities/exercise.js.coffee'

PartsView = require './apps/editor/part.js.coffee'
ContentEditable = require './apps/editor/content_editable.js.coffee'

Marionette = require 'marionette'
Marionette.Behaviors.behaviorsLookup = () -> ExerciseEditor.Behaviors

ExerciseEditor= new Marionette.Application
ExerciseEditor.Behaviors = {}
ExerciseEditor.Behaviors.ContentEditable = ContentEditable

ExerciseEditor.addRegions
  exerciseRegion: "#exercise-content"

ExerciseEditor.on "start", () ->
  partsView = new PartsView()
  ExerciseEditor.exerciseRegion.show(partsView)

ExerciseEditor.start()
