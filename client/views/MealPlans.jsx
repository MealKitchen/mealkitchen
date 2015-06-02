/** @jsx React.DOM */

var Navigation = ReactRouter.Navigation;

var MealPlans = React.createClass({
  
  mixins: [Navigation],

  getInitialState: function(){
    return {mealPlans: []};
  },

  componentDidMount: function(){
    var that = this;

    //This method call gets the user's previous Meal Plans from the server to display on the page.
    this.props.mealPlans.fetch({
      data: {userId: this.props.user.get('id')},
      success: function(){
        var mealPlansArray = that.props.mealPlans.map(function(model, i){
          return model.get('recipes');
        });
        that.setState({mealPlans: mealPlansArray});
      },
      error: function(){
        console.error('There was an error fetching your mealplans!');
      }
    });
  },
  
  _transition: function(e){
    this.transitionTo(e.target.dataset.id);
  },

  render : function() {
    return (
      <div>
        <h1>Your Meal Plan Library</h1>
        {this.state.mealPlans.map(function(mealPlan, i) {
            return (
              <MealPlan key={i} mealPlan={mealPlan}/>
            )
          }, this)}
      </div>
    );
  }
});
