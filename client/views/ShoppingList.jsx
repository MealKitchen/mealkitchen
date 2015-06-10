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
      <div className="container">
        <h1>Shopping List: {this.props.mealPlan.get('title')}</h1>
        <div className="row">
          <ul className='list-group'>
            {that.props.ingredients.map(function(ingredient, i) {
              return [
                  <li className='list-group-item' ref={i} data-id={i} onClick={that.crossout}>{ingredient}</li>
                ]
              })
            }
          </ul>
        </div>
      </div>
    );
  }

});
