/** @jsx React.DOM */

var Dropdown = React.createClass({

  render : function() {

    var numOptions = [];
    for(var i=0; i <= this.props.numOptions; i++){
      numOptions.push(i);
    };

    return (
      <div className="form-group col-md-3">
        <select className="form-control" name={this.props.name} id={this.props.id} defaultValue={this.props.defaultValue} onChange={this.props.handleChange} type={this.props.type}>
          <option value="" disabled>{this.props.placeHolder}</option>
          {numOptions.map(function(option, i){
              return [
                <option value={i}>{i}</option>
              ]
          }, this)}
        </select>
      </div>
    );
  }
});
