# @cjsx React.DOM

React = require 'react'

Exercise = require './components/exercise'
ExerciseModel = require '../../../common/assets/js/entities/exercise.js.coffee'
require '../../../common/assets/js/stubs/api.js'

exercise = new ExerciseModel
  id: 1
  parts: []

React.renderComponent <Exercise model={exercise}/>,
  document.getElementById 'exercise-editor'
