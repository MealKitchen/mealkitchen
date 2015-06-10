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

  componentWillMount: function(){
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
      backgroundSize: 'cover',
      height: '250px'
    };

    return (
      <div style={bgStyle} className="col-md-3 thumbnail " >
        <h3>{this.state.title}</h3>
        <p>{this.state.breakfasts.length} B | {this.state.lunches.length} L | {this.state.dinners.length} D </p>
      </div>
    );
  }
});
