/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var MealPlans = React.createClass({
  
  mixins: [Navigation],

  getInitialState: function() {
    return {};
  },
  
  _transition: function(e){
    this.transitionTo(e.target.dataset.id);
  },

  render : function() {
    return (
      <div>
        <h1>Your Meal Plan Library</h1>
      </div>
    );
  }

});
        // {this.props.mealPlans.map(function(item, i) {
        //   return [
        //     <div className='mealPlan' key={i}>{mealPlans.at(i)}</div>
        //   ];
        // }, this)}
