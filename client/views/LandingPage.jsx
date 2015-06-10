/** @jsx React.DOM */

var LandingPage = React.createClass({

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  render : function() {
    return (
      <div>
        <div className="container">
          <CallToAction linkHandler={this.props.linkHandler} />
        </div>
        <div className="container-fluid howItWorks">
          <div className="row">
            <h2>How it works</h2>
            <HowItWorks />
          </div>
        </div>
      </div>
    );
  }
});
