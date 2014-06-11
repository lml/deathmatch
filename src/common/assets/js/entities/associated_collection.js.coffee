Backbone = require 'backbone'
Backbone.$ = require 'jquery'
require 'backbone-associations'

class AssociatedCollection extends Backbone.Collection
  owner: () ->
    if @parents? and @parents[0]? then return @parents[0]

  resourceName: () ->
    @constructor.name.toLowerCase()

  url: () ->
    owner = @owner()
    if owner then return "#{owner.url()}/#{@resourceName()}"

module.exports = AssociatedCollection
