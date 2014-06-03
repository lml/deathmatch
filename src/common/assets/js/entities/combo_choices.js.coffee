require './_namespace.js.coffee'
require './associated_collection.js.coffee'
require './combo_choice.js.coffee'

class ExerciseEditor.ComboChoices extends ExerciseEditor.AssociatedCollection
  model: ExerciseEditor.ComboChoice

  comparator: (left, right) ->
    # When collection created, parent might not be set so don't sort
    return 0 unless left.owner()?

    numLeft = left.get('combo_simple_choices').length
    numRight = right.get('combo_simple_choices').length

    # Put None of the aboves last.  There can be more than one while editing.
    if numLeft  == 0 then numLeft  = 10000 + left.get('id')
    if numRight == 0 then numRight = 10000 + right.get('id')

    if numLeft == numRight
      # We know that the simple choice arrays are sorted.
      # We also know that there are equal number of choices.
      # The strategy is to compare the item at each position
      # until one of them is lesser.
      res = _.find(
              _.zip(left.selectedSimpleChoices(), right.selectedSimpleChoices()),
                ([l, r]) -> l.compare(r) != 0)
      # If we found something, then we have something comparable,
      # otherwise they are equal.
      if res then res[0].compare(res[1]) else 0
    else
      if numLeft < numRight then -1 else 1
