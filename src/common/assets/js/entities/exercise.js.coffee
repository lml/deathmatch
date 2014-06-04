Backbone = require 'backbone'
require 'backbone_associations'
Part = require './part.js.coffee'
Parts = require './parts.js.coffee'

class Exercise extends Backbone.AssociatedModel

  relations: [
    {
      type: Backbone.Many
      key: 'parts'
      relatedModel: Part
      collectionType: Parts
    }
  ]

  defaults:
    number: ''

module.exports = Exercise
