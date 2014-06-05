Backbone = require 'backbone'
require 'backbone_associations'
_ = require 'underscore'

class Choice extends Backbone.AssociatedModel

  relations: [
    {
      type: Backbone.Many,
      key: 'combos'
      relatedModel: Choice,
    }
  ]

  question: () ->
    @collection.owner()

  position: () ->
    @get('position')

  letter: () ->
    String.fromCharCode(97 + @position())

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

  combos: () ->
    self = this
    if @type() isnt 'simple'
      selections = @get('combos').map (csc) ->
        self.collection.get(csc.get 'choice_id')
      _.sortBy selections, (sc) -> sc.position()

module.exports = Choice
