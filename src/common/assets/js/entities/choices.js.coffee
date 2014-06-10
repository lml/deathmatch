Backbone = require 'backbone'
AssociatedCollection = require './associated_collection.js.coffee'
Choice = require './choice.js.coffee'
$ = require 'jquery'
_ = require 'underscore'

class Choices extends AssociatedCollection
  model: Choice

  positionField: 'position'

  initialize: () ->
    @listenTo this, 'add remove sort', @setPositionsFromIndex

  comparator: (left, right) ->
    left.compare(right)

  savePositions: (options={}) ->
    if @models.length == 0 then return

    _.defaults(
      options,
      {
        attrs:
          order: _.map (@filter (model) -> model.hasChanged), (model) -> {id: model.get('id'), position: model.get(@positionField)}
      })
    @sync 'update', this, options

  setPositionsFromIndex: () ->
    @each (model, index) => model.set(@positionField, index)

  simples: () ->
    @filter (c) -> c.type() is 'simple'

  move: (from, to) ->
    if from instanceof Backbone.Model then from = from.get(@positionField)
    @models.splice(to, 0, @models.splice(from, 1)[0]);
    @setPositionsFromIndex()
    @sort()
    @savePositions
      error: () =>
        # TODO Should save original positions above and have this error function
        # put the models back in that order.  Maybe can use Model#previousAttributes?
        alert 'sort order could not be saved, please reload this page'


module.exports = Choices
