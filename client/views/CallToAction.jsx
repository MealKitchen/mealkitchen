/** @jsx React.DOM */

var CallToAction = React.createClass({

  render : function() {
    return (
      <div className="jumbotron-container">
        <div className="jumbotron">
          <h1 className="default-header">Cook Better Food</h1>
          <h3 className="sub-header">Create personalized meal plans with recipes you&#39;ll love</h3>
          <div className="action-buttons">

            <button
              type='button'
              className="btn btn-primary btn-large"
              data-route='/login'
              onClick={this.props.linkHandler}>
              Log In
            </button>

            <button
              type='button'
              className="btn btn-default btn-large"
              data-route='/signup'
              onClick={this.props.linkHandler}>
              Sign Up
            </button>

          </div>
        </div>
      </div>
    );
  }
});
