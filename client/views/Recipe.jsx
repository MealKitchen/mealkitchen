/** @jsx React.DOM */

var Recipe = React.createClass({

  getInitialState: function(){
    return {};
  },

  _navigateToRecipe: function(){
    window.open('http://www.yummly.com/recipe/external/' + (this.props.recipe.id || this.props.recipe.get('id')));
  },

  render : function() {
    // Getting the image url and modifying it to get the correct size. Note: this could break if Yummly changes their img urls
    var imgUrl = this.props.recipe.smallImgUrl || this.props.recipe.get('smallImageUrls')[0];
    imgUrl = imgUrl.substring(0, imgUrl.length - 2) + '400';
    var bgStyle = {
      backgroundImage: 'url(' + imgUrl + ')',
    };



    //Shorten the recipe name to fit in the recipe preview container if the recipe name is too long!
    var recipeName = this.props.recipe.recipeName || this.props.recipe.get('recipeName');
    if (recipeName.length > 35){
      recipeName = recipeName.substring(0, 35) + '...';
    };

    return (
      <div className="thumbnail recipe-preview col-md-2" style={bgStyle} key={this.props.recipe} onClick={this._navigateToRecipe} >
        <div className={this.props.forReview ? 'review-buttons' : 'hide'} >
          <button type='button' className="btn btn-default btn-small" onClick={this._navigateToRecipe}>View</button>
          <button type='button' className="btn btn-default btn-small" data-position={this.props.position} data-collection={this.props.collection} onClick={this.props.rejectRecipe}>Reject</button>
        </div>
        <div className="overlay">
          <p className="overlay-title">{recipeName}</p>
        </div>
      </div>
    );
  }
});
