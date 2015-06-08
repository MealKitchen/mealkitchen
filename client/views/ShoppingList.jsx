/** @jsx React.DOM */

var ShoppingList = React.createClass({

  mixins: [Backbone.Events],

  getInitialState: function () {
    return {};
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  //TODO: Refactor to persist checked class after refresh. Currently only adds checked class temporarily.
  crossout: function (event) {
    var id = event.target.dataset.id;
    var node = React.findDOMNode(this.refs[id]).classList.toggle("checked");
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
