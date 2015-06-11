/** @jsx React.DOM */

var LandingPage = React.createClass({

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  render : function() {
    return (
      <div className="landing-page-container">
        <CallToAction linkHandler={this.props.linkHandler} />
        <HowItWorks />
      </div>
    );
  }
});
