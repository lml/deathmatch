Backbone = require 'backbone'
require 'backbone_associations'
Questions = require './questions.js.coffee'

class Part extends Backbone.AssociatedModel

  defaults:
    position: -1,
    credit: -1

  relations: [
    {
      type: Backbone.Many,
      key: 'questions',
      collectionType: Questions,
    }
  ]

module.exports = Part
