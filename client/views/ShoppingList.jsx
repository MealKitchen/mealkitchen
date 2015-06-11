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
      <div className="split-container">

        <div className="primary-container">

          <h2 className="page-header">Shopping List: {this.props.mealPlan.get('title')}</h2>

          <ul className='list-group'>
            {that.props.ingredients.map(function(ingredient, i) {
              return [
                  <li className='list-group-item ingredient' ref={i} data-id={i} onClick={that.crossout}>{ingredient}</li>
                ]
              })
            }
          </ul>

        </div>

        <div className="secondary-container">
          <button className="btn btn-primary btn-large" onClick={window.print}>Print Shopping List</button>
        </div>
      </div>
    );
  }

});
