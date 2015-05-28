var ShoppingList = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function () {
    return null;
  },

  componentDidMount: function () {
    var that = this;

    that.listenTo(this.props.mealPlan, 'change', function () {
      console.log('change registered!');
      that.forceUpdate();
    });
  },

  removeIngredient: function (event) {
    var ingredientsList = this.props.mealPlan.get("ingredientsList").slice();
    var id = event.target.dataset.id;
    ingredientsList.splice(id, 1);
    this.props.mealPlan.set({ingredientsList: ingredientsList});
  },

  crossout: function (event) {
    console.log(event.target.dataset.id);
  },

  render: function () {
    var that = this;
    return (
      <div>
      {that.props.mealPlan.get('ingredientsList').map(function(ingredient, i) {
        return [
          <button data-id={i} onClick={that.removeIngredient}>X</button>,
          <div data-id={i}>{ingredient}</div>
          ]
        })
      }
      </div>
    );
  }

});
