/** @jsx React.DOM */

var Recipe = React.createClass({

  _navigateToRecipe: function(){
    window.open(this.props.recipe.recipeUrl);
  },

  render : function() {
    return (
      <div className="recipeContainer" key={recipe}>
        <button type='button' onClick={this._navigateToRecipe}>View</button>          
        <button type='button' onClick={this.props.rejectRecipe}>Reject</button>
        <div className="recipe">{this.props.recipe.recipeName}</div>
        <img className="recipeImage" src={this.props.recipe.smallImgUrl}></img>
      </div>
    );
  }
});
