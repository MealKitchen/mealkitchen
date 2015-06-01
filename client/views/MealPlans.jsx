/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var MealPlans = React.createClass({
  
  mixins: [Navigation],

  getInitialState: function() {
    return {};
  },

  componentWillMount: function(){
    this.props.mealPlans.fetch({data: {userId: this.props.user.get('id')}});
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
