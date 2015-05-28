var ShoppingList = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function () {
    return null;
  },

  componentDidMount: function () {
    var that = this;
    this.listenTo(this.props.ingredients, 'change', function () {
      that.forceUpdate();
    });
  },

  removeIngredient: function (event) {
    console.log("clicked on ingredient to remove!");
    var ingredient = this.props.ingredients.splice(event.target.dataset.id, 0);

  },

  render: function () {
    var that = this;
    return (
      <div>
      {this.props.ingredients.map(function(ingredient, i) {
        return [
          <button data-id={i} onClick={that.removeIngredient}>X</button>,
          <div>{ingredient}</div>
          ]
        })
      }
      </div>
    );
  }

});
