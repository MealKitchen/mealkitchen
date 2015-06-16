/** @jsx React.DOM */

var Recipe = React.createClass({

  getInitialState: function(){
    return {};
  },

  _navigateToRecipe: function(){
    var baseUrl = 'http://www.yummly.com/recipe/external/';
    window.open(baseUrl + (this.props.recipe.id || this.props.recipe.get('id')));
  },

  render : function() {
    //Get the image url from Yummly and modify it to get a bigger image.
    //Note: this will probably break if Yummly changes their image urls.
    var imgUrl = this.props.recipe.smallImgUrl || this.props.recipe.get('smallImageUrls')[0];
    imgUrl = imgUrl.substring(0, imgUrl.length - 2) + '400';
    var bgStyle = {
      backgroundImage: 'url(' + imgUrl + ')',
    };

    var recipeClasses = this.props.forReview ?
                        'thumbnail recipe-preview col-sm-2' :
                        'thumbnail recipe-preview link-to-recipe col-sm-2';

    //Shorten the recipe name to fit in the recipe preview container if the recipe name is too long.
    var recipeName = this.props.recipe.recipeName || this.props.recipe.get('recipeName');
    if (recipeName.length > 35){
      recipeName = recipeName.substring(0, 35) + '...';
    };

    return (
      <div
        className={recipeClasses}
        style={bgStyle} key={this.props.recipe}
        onClick={this.props.forReview ? function(){} : this._navigateToRecipe} >

        <div className={this.props.forReview ? 'review-buttons' : 'hide'} >

          <button
            type='button'
            className="btn btn-default btn-small"
            onClick={this._navigateToRecipe}>
              View
          </button>

          <button
          type='button'
          className="btn btn-default btn-small"
          data-position={this.props.position}
          data-collection={this.props.collection}
          onClick={this.props.rejectRecipe}>
            Reject
          </button>

        </div>
        <div className="overlay">
          <p className="overlay-title">{recipeName}</p>
        </div>
      </div>
    );
  }
});
