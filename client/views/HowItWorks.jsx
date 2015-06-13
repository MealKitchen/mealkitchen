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
        <div className="attribution-container">
          <p>Built by &nbsp;
          <a href="https://www.linkedin.com/in/asponring" target="_blank">Andy Sponring</a>,&nbsp; 
          <a href="https://www.linkedin.com/in/marktausch" target="_blank">Mark Tausch</a>,&nbsp;
          <a href="http://zackfischmann.com/" target="_blank">Zack Fischmann</a>,&nbsp;and&nbsp; 
          <a href="https://www.linkedin.com/in/melaniegin" target="_blank">Melanie Gin</a>&nbsp;|&nbsp;
          View on &nbsp; 
          <a href="https://github.com/Unconditional-Chocolate/mealplan" target="_blank">GitHub</a>
          </p>
        </div>
      </div>
    );
  }
});