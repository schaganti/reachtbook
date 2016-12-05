var headers = ["Book", "Author", "Language", "Published", "Sales"];
var data = [
    ['book3', 'author1', 'lang1', 'pub1', 'sales1'],
    ['book6', 'author2', 'lang2', 'pub2', 'sales2'],
    ['book5', 'author3', 'lang3', 'pub3', 'sales3']
];


var Excel = React.createClass({
    displayName: 'excel',

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
        };
    },

    _sort: function(e) {
        var data = this.state.data.slice();
        var column = e.target.cellIndex;
        var descending = this.state.sortby === column && !this.state.descending;
        data.sort(function(row1, row2) {
            return descending ? (row1[column] > row2[column] ? 1 : -1) : (row1[column] > row2[column] ? -1 : 1);
        });
        this.setState({
            data: data,
            descending: descending,
            sortby: column
        });

    },

    render: function() {

        var sortby = this.state.sortby;
        var descending = this.state.descending;

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
            React.DOM.tbody(null, this.state.data.map(function(row, idx) {
                return React.DOM.tr({
                    key: idx
                }, row.map(function(cell, idx) {
                    return React.DOM.td({
                        key: idx
                    }, cell);
                }));
            }))
        );
    },
});

ReactDOM.render(
    React.createElement(Excel, {
        headers: headers,
        initalData: data
    }), document.getElementById('app'));
