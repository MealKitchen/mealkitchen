/** @jsx React.DOM */

var MealPlanLibrary = React.createClass({

  getInitialState: function(){
    return {mealPlans: []};
  },

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  componentDidMount: function(){
    var that = this;
    //This method call gets the user's previous Meal Plans from the server to display on the page.
    var mealPlans = new MealPlansCollection(this.props.user);
    mealPlans.fetch({
      success: function(collection, res, options){
        that.replaceState({ mealPlans: collection });
        that.props.setMealPlans(collection);
      },
      error: function(collection, res, options){
        console.error('There was an error fetching your mealplans!');
      }
    });
  },

  render: function() {
    return (
      <div className="library-container">
        <h1 className="page-header">
          Meal Plan Library ({this.props.mealPlans ? this.props.mealPlans.length : 0})
        </h1>
        <div className="row">

          <div
            className="col-md-3 thumbnail meal-plan-preview create-meal-plan"
            data-route='/mealquery'
            onClick={this.props.linkHandler}>

            <span
              className="glyphicon glyphicon-plus"
              data-route='/mealquery'
              onClick={this.props.linkHandler}
              aria-hidden="true">
            </span>
            <p className="overlay-title">Create New Meal Plan</p>
          </div>

          {this.props.mealPlans ? this.props.mealPlans.map(function(mealPlan, i) {
              return (
                <MealPlanLink
                  key={i}
                  mealPlan={mealPlan}
                  setMealPlan={this.props.setMealPlan}
                  transitionTo={this.props.transitionTo} />
              )
            }, this) : function(){}}

        </div>
      </div>
    );
  }
});
