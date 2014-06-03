require './_namespace.js.coffee'

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
