Backbone = require 'backbone'
require 'backbone_associations'

class ExerciseEditor.AssociatedCollection extends Backbone.Collection
  owner: () ->
    if @parents? and @parents[0]? then return @parents[0]

  resourceName: () ->
    @constructor.name.toLowerCase()

  url: () ->
    owner = @owner()
    if owner then return "#{@owner.url()}/#{@resourceName()}"
