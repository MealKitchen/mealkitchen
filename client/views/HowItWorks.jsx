/** @jsx React.DOM */

var HowItWorks = React.createClass({

  render : function() {
    return (
      <div className="container-fluid bottom-fill">
        <div className="col-md-4">
          <img></img>
          <h3>1. Search for recipes based on preferences</h3>
        </div>
        <div className="col-md-4">
          <img></img>
          <h3>2. Review recipes and confirm meals</h3>
        </div>
        <div className="col-md-4">
          <img></img>
          <h3>3. Generate list of ingredients for purchase</h3>
        </div>
      </div>
    );
  }
});
