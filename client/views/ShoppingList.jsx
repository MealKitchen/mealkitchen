var ShoppingList = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function () {
    return null;
  },

  componentDidMount: function () {
    var that = this;
    this.listenTo(this.props.mealPlan, 'change', function () {
      console.log('change registered!');
      that.forceUpdate();
    });
  },

  //This code exists to remove ingredients from the view altogether.

  // removeIngredient: function (event) {
  //   var ingredientsList = this.props.mealPlan.get("ingredientsList").slice();
  //   var id = event.target.dataset.id;
  //   ingredientsList.splice(id, 1);
  //   this.props.mealPlan.set({ingredientsList: ingredientsList});
  // },

  //TODO: Refactor to persist checked class after refresh. Currently only adds checked class temporarily.
  crossout: function (event) {
    console.log(event.target.dataset.id);
    React.findDOMNode(this.refs[event.target.dataset.id]).classList.add("checked");
  },

  render: function () {
    var that = this;
    console.log(this.props);
    return (
      <div>
      {that.props.mealPlan.get('ingredientsList').map(function(ingredient, i) {
        return [
          <button data-id={i} onClick={that.crossout}>X</button>,
          <div ref={i} data-id={i}>{ingredient}</div>
          ]
        })
      }
      </div>
    );
  }

});
