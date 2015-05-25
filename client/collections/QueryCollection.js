var QueryCollection = Backbone.Collection.extend({
    model: QueryModel,
    url: 'api/recipes/makeplan'
});