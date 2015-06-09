/** @jsx React.DOM */

var Recipe = React.createClass({

  getInitialState: function(){
    return { forReview: true };
  },

  componentWillMount: function(){
    this.setState({ forReview: this.props.forReview || this.state.forReview });
    console.log(this.props.recipe);
  },

  _navigateToRecipe: function(){
    window.open(this.props.recipe.get('recipeUrl'));
  },

  render : function() {
    return (
      <div className="recipeContainer" key={this.props.recipe}>
        <div id={this.props.forReview ? 'show' : 'hide'}>
          <button type='button' onClick={this._navigateToRecipe}>View</button>
          <button type='button' data-position={this.props.position} data-collection={this.props.collection} onClick={this.props.rejectRecipe}>Reject</button>
        </div>
        <div className="recipe">{this.props.recipe.get('recipeName')}</div>
        <img className="recipeImage" src={this.props.recipe.get('smallImageUrls')[0]}></img>
      </div>
    );
  }
});
