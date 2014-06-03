require './_namespace.js.coffee'

class ExerciseEditor.SimpleChoices extends ExerciseEditor.AssociatedCollection
  model: ExerciseEditor.SimpleChoice

  @mixin ExerciseEditor.CollectionSorting
