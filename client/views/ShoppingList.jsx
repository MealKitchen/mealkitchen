/** @jsx React.DOM */

var ShoppingList = React.createClass({

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  componentDidMount: function(){
    window.addEventListener('touchend', this.crossout);
  },

  crossout: function (e) {
    var id = e.target.dataset.id;
    var node = React.findDOMNode(this.refs[id]).classList.toggle("checked");
  },

  render: function () {
    var that = this;

    return (
      <div className="split-container">
        <div className="row">
          <div className="primary-container col-md-10">
            <h2 className="page-header">
              Shopping List: {this.props.mealPlan.get('title')}
            </h2>
            <ul className='list-group'>

              {that.props.shoppingList.map(function(ingredient, i) {
                return [
                    <li
                      className='list-group-item ingredient'
                      ref={i}
                      data-id={i}
                      onClick={that.crossout}>
                        {ingredient}
                    </li>
                  ]
                })
              }

            </ul>
          </div>
          <div className="secondary-container col-md-2">

            <button
              className="btn btn-primary btn-large"
              onClick={window.print}>
                Print Shopping List
            </button>

          </div>
        </div>
      </div>
    );
  }

});
