/** @jsx React.DOM */

var CallToAction = React.createClass({

  render : function() {
    return (
      <div>
        <h1>Cook Better Food</h1>
        <h2>Create personalized meal plans with recipes you'll love</h2>
        <button type='button' data-route='/login' onClick={this.props.linkHandler}>Log In</button>          
        <button type='button' data-route='/signup' onClick={this.props.linkHandler}>Sign Up</button>
      </div>
    );
  }
});
