Marionette = require 'marionette'
ExerciseModel = require '../../../common/assets/js/entities/exercise.js.coffee'
ExerciseView = require './views/exercise.js.coffee'
PartsCollection = require '../../../common/assets/js/entities/parts.js.coffee'
require '../../../common/assets/js/stubs/api.js'

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
