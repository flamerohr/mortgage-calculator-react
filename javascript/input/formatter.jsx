import React from 'react';

const propTypes = {
	onChange: React.PropTypes.func,
	format:   React.PropTypes.shape({
		toView:   React.PropTypes.func,
		fromView: React.PropTypes.func
	}).isRequired
};

const defaultProps = {
	onChange: () => {}
};

const functions = [
	'handleChange',
	'handleBlur'
];

class Formatter extends React.Component {
	constructor (props) {
		super(props);

		this.init(props);

		functions.forEach((func) => {
			this[func] = this[func].bind(this);
		});
	}

	init (props) {
		if (!this.state) {
			this.state = {
				value: this.props.format.toView(props.value)
			};
		}
	}

	handleChange (e) {
		let format = this.props.format,
				value  = e.target.value,
				data   = format.fromView(value);

		e.target.data = data;

		this.props.onChange(e);

		this.setState({
			value: value
		});
	}

	handleBlur (e) {
		let format = this.props.format,
				data   = format.fromView(e.target.value);

		this.setState({
			value: format.toView(data)
		});
	}

	render () {
		let props  = this.props,
				format = props.format,
				value  = this.state.value;

		if (typeof value === 'undefined' || props.value !== format.fromView(value)) {
			value = format.toView(props.value);
		}

		return <input { ...props } value={ value } onChange={ this.handleChange }/>;
	}

}
Formatter.propTypes = propTypes;
Formatter.defaultProps = defaultProps;

export default Formatter;