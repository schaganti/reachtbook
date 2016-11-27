var component = React.createClass({
    render: function() {
        return React.DOM.span(null, "This is working for me");
    }
})


ReactDOM.render(React.DOM.h1({
        id: 'my-header',
        className: 'chags',
        htmlFor: "me",
        style: {
            background: 'blue',
            color: 'white'
        }
    }, React.createElement(component), " This is great"),
    document.getElementById('app'));
