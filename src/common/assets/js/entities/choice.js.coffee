Backbone = require 'backbone'
require 'backbone_associations'
_ = require 'underscore'

class Choice extends Backbone.AssociatedModel

  question: () ->
    @collection.owner()

  position: () ->
    @get('position')

  letter: () ->
    String.fromCharCode(97 + @position())

  canMoveUp: () ->
    @type() is 'simple' and @position() > 0

  canMoveDown: () ->
    isBottom = () =>
      @position() is @collection.length - 1
    isLastSimpleChoice = () =>
      @collection.at(@position() + 1).type() isnt 'simple'
    @type() is 'simple' and not (isBottom() or isLastSimpleChoice())

  type: () ->
    @get('type')

  weight: () ->
    switch @type()
      when 'simple' then -100 + @position()
      when 'all'  then 500
      when 'none' then 10000
      else @get('combos').length

  compare: (other) ->
    leftWins = -1
    rightWins = 1
    tied = 0

    simple_compare = (l, r) ->
      switch
        when l is r then tied
        when l < r then leftWins
        else rightWins

    result = simple_compare @weight(), other.weight()
    if result is tied and @type() is other.type() is 'combo'
      res = _.find(
              _.zip(@combos(), other.combos()),
                ([l, r]) -> l.compare(r) isnt tied)
      if res then res[0].compare(res[1]) else tied
    else result

  setSelections: (ids) ->
    if @type() is 'combo'
      # TODO: Validate ids.
      @set({'combos': ids})

  selections: () ->
    if @type() is 'combo'
      simples = @collection.filter (c) => c.type() is 'simple'
      combos = @get('combos')
      selected = (simple) ->
        _.contains(combos, simple.get('id'))
      statuses = {}
      ([simple, selected(simple)] for simple in simples)

  combos: () ->
    if @type() is 'combo'
      selections = @get('combos').map (csc) =>
        @collection.get(csc)
      _.sortBy selections, (sc) -> sc.position()

  moveUp: () ->
    if @canMoveUp()
       idx = @position()
      @collection.move idx, idx-1

  moveDown: () ->
    if @canMoveDown()
       idx = @position()
      @collection.move idx, idx+1

module.exports = Choice
