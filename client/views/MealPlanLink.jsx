/** @jsx React.DOM */

var MealPlanLink = React.createClass({

  getInitialState: function(){
    return {
      title: this.props.mealPlan.get('title'),
      breakfasts: this.props.mealPlan.get('breakfastRecipes'),
      lunches: this.props.mealPlan.get('lunchRecipes'),
      dinners: this.props.mealPlan.get('dinnerRecipes'),
    }
  },

  _mealLink: function(){
    this.props.setMealPlan(this.props.mealPlan);
    this.props.transitionTo('/mealplan');
  },

  render : function() {

    //Find main focus of meal plan to display appropriate image on the screen to represent the Meal Plan. Currently defaults to dinner.
    var imgUrl;
    if(this.state.dinners.length > 0){
      imgUrl = this.state.dinners[0].smallImgUrl;
    } else if(this.state.lunches.length > 0){
      imgUrl = this.state.lunches[0].smallImgUrl;
    } else {
      imgUrl = this.state.breakfasts[0].smallImgUrl;
    }

    imgUrl = imgUrl.substring(0, imgUrl.length - 2) + '400';

    var bgStyle = {
      backgroundImage: 'url(' + imgUrl + ')',
    };

    return (
      <div style={bgStyle} onClick={this._mealLink} className="col-md-3 thumbnail meal-plan-preview">
        <div className="overlay">
          <p className="overlay-title">{this.state.title}</p>
          <p className="overlay-text">{this.state.dinners.length} D | {this.state.lunches.length} L | {this.state.breakfasts.length} B </p>
        </div>
      </div>
    );
  }
});
