var QueryModel = Backbone.Model.extend({

  url: 'api/queries',

  defaults: {
    'offsetB': 0,
    'offsetL': 0,
    'offsetD': 0
  },

  incrementOffset: function(course){
    switch(course){
      case "breakfast":
        this.set({
          offsetB: this.get('offsetB') + 1
        });
        break;
      case "lunch":
        this.set({
          offsetL: this.get('offsetL') + 1
        });
        break;
      case "dinner":
        this.set({
          offsetD: this.get('offsetD') + 1
        });
        break;
    }
  }

});
