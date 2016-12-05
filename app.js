//Chapter3
var headers = ["Book", "Author", "Language", "Published", "Sales"];
var data = [
  ['book3', 'author1', 'lang1', 'pub1', 'sales1'],
  ['book6', 'author2', 'lang2', 'pub2', 'sales2'],
  ['book5', 'author3', 'lang3', 'pub3', 'sales3']
];


var Excel = React.createClass({
  displayName: 'excel',

  _preSearchData: null,

  _log: [],

  propTypes: {
    headers: React.PropTypes.arrayOf(
      React.PropTypes.string
    ),

    initalData: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(
        React.PropTypes.string
      )
    )
  },

  getInitialState: function() {
    return {
      data: this.props.initalData,
      descending: true,
      sortby: null,
      edit: null,
      search: false,
    };
  },

  _logSetState: function(newState) {
    this._log.push(JSON.parse(JSON.stringify(this._log.length == 0 ? this.state: newState)));
    this.setState(newState);
  },

  _replay: function() {
    if(this._log.length == 0) {
      console.log('nothing to replay');
      return;
    }
    var idx = -1;
    var inter = setInterval(function () {
      idx++;
      if(idx === this._log.length -1) {
        clearInterval(inter);
      }
      this.setState(this._log[idx]);
    }.bind(this), 1000);

  },

  componentDidMount: function() {
    document.onkeydown = function(e) {
      if(e.altKey && e.shiftKey && e.keyCode == 82) {
        this._replay();
      }
    }.bind(this);
  },

  _edit: function(e) {
    this._logSetState({
      edit: {
        row: e.target.dataset.row,
        col: e.target.cellIndex
      }
    });
  },

  _sort: function(e) {
    var data = this.state.data.slice();
    var column = e.target.cellIndex;
    var descending = this.state.sortby === column && !this.state.descending;
    data.sort(function(row1, row2) {
      return descending ? (row1[column] > row2[column] ? 1 : -1) : (row1[column] > row2[column] ? -1 : 1);
    });
    this._logSetState({
      data: data,
      descending: descending,
      sortby: column
    });

  },

  _save: function(e) {
    e.preventDefault();
    var data = this.state.data.slice();
    data[this.state.edit.row][this.state.edit.col] = e.target.firstChild.value;
    this._logSetState({
      data: data,
      edit: null
    });
  },

  _toggleSearch: function() {

    if (this.state.search) {
      this._logSetState({
        search: false,
        data: this._preSearchData,
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this._logSetState({
        search: true,
      });
    }
  },

  _search: function(e) {
    var needle = e.target.value.toLowerCase();
    if (!needle) {
      this._logSetState({
        data: this._preSearchData,
      });
    } else {
      this._logSetState({
        data: this._preSearchData.filter(function(row) {
          return row[e.target.dataset.idx].toString().toLowerCase().indexOf(needle) > -1;
        })
      });
    }

  },

  _renderSearch: function() {
    var self = this;
    if (!this.state.search) {
      console.log("Retun null");
      return null;
    }
    return React.DOM.tr({
      onChange: self._search
    }, this.props.headers.map(function(_ignore, idx) {
      return React.DOM.td({
        key: idx
      }, React.DOM.input({
        type: 'text',
        'data-idx': idx,
      }))
    }));
  },

  _renderTable: function() {

    var sortby = this.state.sortby;
    var descending = this.state.descending;
    var edit = this.state.edit;
    //This variable needed to be added here so it can be referred in the function to handle edit usecase.
    var _save = this._save;

    return React.DOM.table(null,
      React.DOM.thead({
        onClick: this._sort
      },
      React.DOM.tr(null,
        this.props.headers.map(function(title, idx) {
          if (sortby === idx) {
            title += descending ? '\u2191' : '\u2193';
          }
          return React.DOM.th({
            key: idx
          }, title);
        }))),
        React.DOM.tbody({
          onDoubleClick: this._edit
        }, this._renderSearch(), this.state.data.map(function(row, rowIdx) {
          return React.DOM.tr({
            key: rowIdx
          }, row.map(function(cell, idx) {
            var content = cell;
            if ((edit && edit.row == rowIdx && edit.col == idx)) {
              content = React.DOM.form({
                onSubmit: _save,
                action: ''
              }, React.DOM.input({
                type: 'text',
                defaultValue: content,
              }));
            }
            return React.DOM.td({
              'data-row': rowIdx,
              key: idx,
            }, content);
          }));
        }))
      );
    },

    _renderToolBar: function() {
      return React.DOM.button({
        onClick: this._toggleSearch
      }, "Search");
    },

    render: function() {
      return React.DOM.div(null, this._renderToolBar(), this._renderTable());
    },


  });

  ReactDOM.render(
    React.createElement(Excel, {
      headers: headers,
      initalData: data
    }), document.getElementById('app'));
