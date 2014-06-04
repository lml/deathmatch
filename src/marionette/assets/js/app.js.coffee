Marionette = require 'marionette'
ExerciseModel = require './entities/exercise.js.coffee'
ExerciseView = require './views/exercise.js.coffee'

ExerciseEditor = new Marionette.Application

ExerciseEditor.addRegions
  exerciseRegion: "#exercise-editor"

ExerciseEditor.on "start", () ->
  exercise = new ExerciseModel
  exerciseView = new ExerciseView
    model: exercise
  ExerciseEditor.exerciseRegion.show exerciseView

ExerciseEditor.start()
