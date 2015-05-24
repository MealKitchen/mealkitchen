var AppView = React.createClass({
  render: function() {
    return (
      <MealQuery />
    );
  }
});

React.render(<AppView />, document.body);
