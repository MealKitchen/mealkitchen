var AppView = React.createClass({
  render: function() {
    return (
      <MealQuery name="Zack" />
    );
  }
});

React.render(<AppView />, document.body);
