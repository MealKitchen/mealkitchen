/** @jsx React.DOM */
var AppView = React.createClass({
  
  getInitialState: function(){
    return {
      querySent: false,
      planApproved: false
     };
  },

  querySubmitted: function(){
    this.setState({querySent: true});
  },

  render: function() {
    if(!this.state.querySent){
      return (
        <MealQuery onSubmit={this.querySubmitted}/>
      );
    } else {
      return (
        <ReviewMeals />
      );
    }
  }
});

React.render(<AppView />, document.body);
