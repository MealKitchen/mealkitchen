/** @jsx React.DOM */

var CallToAction = React.createClass({

  render : function() {
    return (
      <div className="jumbotron">
        <h1 className="slogan">Cook Better Food</h1>
        <h2 className="subSlogan">Create personalized meal plans with recipes you&#39;ll love</h2>
        <div className="logInOrSignUp">
          <button type='button' data-route='/login' onClick={this.props.linkHandler}>Log In</button>
          <button type='button' data-route='/signup' onClick={this.props.linkHandler}>Sign Up</button>
        </div>
      </div>
    );
  }
});
