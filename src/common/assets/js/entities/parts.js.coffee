Backbone = require 'backbone'
require 'backbone_associations'
require './associated_collection.js.coffee'
require './part.js.coffee'

class ExerciseEditor.Parts extends ExerciseEditor.AssociatedCollection
  model: ExerciseEditor.Part
