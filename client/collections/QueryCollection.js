var QueryCollection = Backbone.Collection.extend({
    model: QueryModel,
    url: 'api/queries'
});
