Marionette = require 'marionette'
ExerciseModel = require './entities/exercise.js.coffee'
ExerciseView = require './views/exercise.js.coffee'
PartsCollection = require './entities/parts.js.coffee'
require './stubs/api.js'

ExerciseEditor = new Marionette.Application

ExerciseEditor.addRegions
  exerciseRegion: "#exercise-editor"

ExerciseEditor.on "start", () ->
  exercise = new ExerciseModel
    id: 1
  exercise.set
    parts: new PartsCollection
  exerciseView = new ExerciseView
    model: exercise
  ExerciseEditor.exerciseRegion.show exerciseView

ExerciseEditor.start()
