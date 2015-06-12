/** @jsx React.DOM */

var Checklist = React.createClass({

  render : function() {

    var that=this;

    var numOptions = [];
    for(var i=0; i <= this.props.numOptions; i++){
      numOptions.push(i);
    };

    return (
      <div className="form-group col-md-3">
        <div className="filter-label">{this.props.label}</div>
        {this.props.filterOptions.map(function(item, i){
          return [
            <div className="checkbox">
              <label>
                <input type="checkbox" name={this.props.name} value={item} className="checkbox" onChange={this.props.handleChange} />{item}
              </label>
            </div>
          ];
        }, this)}
        {this.props.truncated ? function(){
          return [
            <div className='toggle-filter' data-filter={that.props.dataFilter} onClick={that.props.toggle}>
              <span data-filter={that.props.dataFilter}>{that.props.seeMoreAllergies ? 'See less ' : 'See more '}</span>
              <span data-filter={that.props.dataFilter} className={that.props.seeMoreAllergies ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down"} aria-hidden="true"></span>
            </div>
          ]
        }() : function(){} }
      </div>
    );
  }
});

