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
    var mealPlans = new MealPlansCollection();
    mealPlans.fetch({
      data: { userId: this.props.user.id },
      success: function(collection, res, options){
        var mealPlansArray = mealPlans.map(function(model, i){
          return model;
        });
        mealPlansArray.reverse();
        that.setState({mealPlans: mealPlansArray});
        that.props.setMealPlans(mealPlans);
      },
      error: function(collection, res, options){
        console.error('There was an error fetching your mealplans!');
      }
    });
  },

  render : function() {
    return (
      <div className="library-container">
        <h1 className="page-header">Meal Plan Library ({this.state.mealPlans.length})</h1>
        <div className="row">

          <div
            className="col-md-3 thumbnail meal-plan-preview create-meal-plan"
            data-route='/mealquery'
            onClick={this.props.linkHandler}>

            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
            <p className="overlay-title">Create New Meal Plan</p>
          </div>

          {this.state.mealPlans.map(function(mealPlan, i) {
              return (
                <MealPlanLink
                  key={i}
                  mealPlan={mealPlan}
                  setMealPlan={this.props.setMealPlan}
                  transitionTo={this.props.transitionTo} />
              )
            }, this)}

        </div>
      </div>
    );
  }
});
