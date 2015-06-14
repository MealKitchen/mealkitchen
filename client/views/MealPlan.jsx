/** @jsx React.DOM */

var MealPlan = React.createClass({

  componentWillMount: function(){
    this.props.setBGImg(false);
  },

  _createShoppingList: function(){
    var that = this;
    $.ajax({
      type: "POST",
      url: "api/mealplans/" + that.props.mealPlan.id + "/shoppinglist",
      // data: JSON.stringify(that.props.mealPlan.id),
      dataType: "json",
      contentType: "application/json",
      success: function(res){
        that.props.setShoppingList(res);
        that.props.transitionTo('/shoppinglist');
      },
      error: function(xhr, ajaxOptions, thrownError){
        alert('There was an error with your request!');
      }
    });
  },

  // dynamically render recipes on page according to Meal Plan
  render: function() {
      return (
        <div className="split-container">
          <div className="row">
            <div className="primary-container col-md-10">
              <h1 className="page-header">Meal Plan: {this.props.mealPlan.get('title')}</h1>

              <div className="course-container">
                <h3 className="section-header">Dinner</h3>
                <div className="row">
                  {this.props.mealPlan.get('dinnerRecipes').map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={false}
                        collection='dinnerCollection' />
                    ];
                  }, this)}
                </div>
              </div>

              <div className="course-container">
                <h3 className="section-header">Lunch</h3>
                <div className="row">
                  {this.props.mealPlan.get('lunchRecipes').map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={false}
                        collection='lunchCollection' />
                    ];
                  }, this)}
                </div>
              </div>

              <div className="course-container">
                <h3 className="section-header">Breakfast</h3>
                <div className="row">
                  {this.props.mealPlan.get('breakfastRecipes').map(function(item, i) {
                    return [
                      <Recipe
                        recipe={item}
                        position={i}
                        forReview={false}
                        collection='breakfastCollection' />
                    ];
                  }, this)}
                </div>
              </div>

              <div className="secondary-container col-md-2">

                <p>Recipe search powered by
                  <a href='http://www.yummly.com/recipes' target="_blank">
                    <img alt='Yummly' src='http://static.yummly.com/api-logo.png'/>
                  </a>
                </p>

              </div>

            </div>
            <div className="secondary-container col-md-2">

              <button
                className="btn btn-primary btn-large"
                type='button'
                onClick={this._createShoppingList}>
                Create Shopping List
              </button>

            </div>

          </div>
        </div>
      );
    }
});
