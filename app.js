var logMixin = {
  _log: function(methodName, args) {
    console.log(this.name + "::" + methodName, args);
  },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //     return true;
  // },

  componentWillUpdate: function() {
    this._log("componentWillUpdate", arguments);
  },

  componentDidUpdate: function() {
    this._log("componentDidUpdate", arguments);
  },

  componentWillMount: function() {
    this._log("componentWillMount", arguments);
  },

  componentDidMount: function() {
    this._log("componentDidMount", arguments);
  },

};

var Counter = React.createClass({
  name: "CounterComponent",
  //mixins: [logMixin],

  propTypes: {
    count: React.PropTypes.number,
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if(nextProps.count == this.props.count) {
      return false;
    }
    return true;
  },

  getDefaultProps: function() {
    return {
      count: 0,
    };
  },

  render: function() {
    return React.DOM.h3(null, this.props.count);
  }

});

var TextAreaCounter = React.createClass({

  name: "TextAreaComponent",

  mixins: [logMixin],

  propTypes: {
    text: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      text: '',
    }
  },

  getInitialState: function() {
    return {
      text: this.props.text,
    }
  },

  _textChange: function(ev) {
    this.setState({
      text: ev.target.value,
    })
  },

  render: function() {

    var counter = null;
    if (this.state.text.length > 0) {
      counter = React.createElement(Counter, {
        count: this.state.text.length
      });
    }
    return React.DOM.div(null, React.DOM.textarea({
      value: this.state.text,
      onChange: this._textChange,
    }), counter);
  }

});


var renderedComp = ReactDOM.render(React.createElement(TextAreaCounter, {
  //text: 'Chaganti Srinivasas'
}),
document.getElementById('app'));
