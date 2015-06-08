/** @jsx React.DOM */

var Recipe = React.createClass({

  componentWillMount: function(){
    console.log(this.props);
  },

  _navigateToRecipe: function(){
    window.open(this.props.recipe.get('recipeUrl'));
  },

  render : function() {
    return (
      <div className="recipeContainer" key={this.props.recipe}>
        <button type='button' onClick={this._navigateToRecipe}>View</button>          
        <button type='button' data-position={this.props.position} data-collection={this.props.collection} onClick={this.props.rejectRecipe}>Reject</button>
        <div className="recipe">{this.props.recipe.get('recipeName')}</div>
        <img className="recipeImage" src={this.props.recipe.get('smallImgUrl')}></img>
      </div>
    );
  }
});
