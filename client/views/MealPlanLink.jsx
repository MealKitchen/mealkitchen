/** @jsx React.DOM */

var MealPlanLink = React.createClass({

  getInitialState: function(){
    return {
      title: this.props.mealPlan.title,
      breakfasts: this.props.mealPlan.get('breakfastRecipes'),
      lunches: this.props.mealPlan.get('lunchRecipes'),
      dinners: this.props.mealPlan.get('dinnerRecipes'),
      mainCourse: null
    }
  },

  componentWillMount: function(){
    //Find focus of meal plan to display appropriate information on the screen.
    var mainCourse;
    if(this.state.dinners){
      this.setState({ mainCourse: this.state.dinners[0] });
    } else if(this.state.lunches){
      this.setState({ mainCourse: this.state.lunches[0] });
    } else {
      this.setState({ mainCourse: this.state.breakfasts[0] });
    }
  },

  render : function() {
    return (
      <div>
        <h3>{this.state.title}</h3>
        <p>{this.state.breakfasts.length} B | {this.state.lunches.length} L | {this.state.dinners.length} D </p>
        <img src={this.state.mainCourse.get('smallImageUrls')[0]}></img>
      </div>
    );
  }
});
