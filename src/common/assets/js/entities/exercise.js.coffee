Backbone = require 'backbone'
require 'backbone_associations'

class ExerciseEditor.Exercise extends Backbone.AssociatedModel

  relations: [
    {
      type: Backbone.Many,
      key: 'parts',
      relatedModel: 'ExerciseEditor.Part'
      collectionType: 'ExerciseEditor.Parts',
    }
  ]

  defaults:
    number: ''
