/** @jsx React.DOM */

var HowItWorks = React.createClass({

  render : function() {
    return (
      <div className="how-it-works-container">
        <h1 className="default-header">How it works</h1>
        <div className="row">
          <div className="col-md-4 step">
            <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
            <p className="step-text">1. Search for recipes based on preferences</p>
          </div>
          <div className="col-md-4 step">
            <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
            <p className="step-text">2. Review recipes and confirm meals</p>
          </div>
          <div className="col-md-4 step">
            <span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
            <p className="step-text">3. Generate list of ingredients for purchase</p>
          </div>
        </div>
      </div>
    );
  }
});
