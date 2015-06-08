/** @jsx React.DOM */

var LandingPage = React.createClass({

  componentWillMount: function(){
    this.props.setBGImg(true);
  },

  render : function() {
    return (
      <div>
        <CallToAction linkHandler={this.props.linkHandler} />
        <HowItWorks />
      </div>
    );
  }
});
