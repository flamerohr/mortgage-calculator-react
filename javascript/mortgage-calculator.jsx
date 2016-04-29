import React from 'react';
import FormatterInput from './input/formatter';
import MortgageEngine from './lib/mortgage-engine';
import PaymentPeriods from './constants/payment-periods';

import DecimalValueConverter from './converters/decimal';
import CurrencyValueConverter from './converters/currency';
import PercentValueConverter from './converters/percent';

const convert = {
		currency:  new CurrencyValueConverter,
		decimal: new DecimalValueConverter,
		percent: new PercentValueConverter
	};
const propTypes = {
	formData: React.PropTypes.object,
	onChange: React.PropTypes.func
};

const defaultProps = {
	formData: {},
	onChange: () => {}
};
const fields = [
	'principal',
	'interest',
	'term',
	'period',
	'payments'
];
const functions = [
	'handleChange',
	'getPeriodText',
	'getInterest'
];

class MortgageCalculator extends React.Component {
	constructor (props, ...args) {
		super(props, ...args);

		this.init(props);

		functions.forEach((func) => {
			this[func] = this[func].bind(this);
		});
	}

	init (props) {
		let data = props.formData;

		if (!this.engine) {
			this.engine = new MortgageEngine(data.principal, data.interest);
		}
		if (!this.state) {
			this.state = {
				formData: data
			};
		}
		this.periods = PaymentPeriods;
	}

	componentDidMount () {
		let data = this.updateEngine();

		// update data on state and parent after synchronise
		this.props.onChange(this.props.key, data);
		
		this.setState({ formData: data });
	}

	// synchronise engine properties with state
	updateEngine () {
		let engine = this.engine,
				data   = this.state.formData;

		fields.forEach((property) => {
			// synchronise a property to the engine if defined, otherwise use engine's property
			if (typeof data[property] !== 'undefined') {
				engine[property] = data[property];
			}
			else if (property !== 'payments') {
				data[property] = engine[property];
			}
		});

		// now that engine properties are synchronise, update computed field
		if (data.changePayment) {
			data.term = +(this.engine.getPaymentTerm(data.payments)
				.toFixed(1));
			engine.term = data.term;
		}
		else {
			data.payments = +(this.engine.getPaymentAmount()
				.toFixed(2));
		}

		return data;
	}

	handleChange (e) {
		let field     = e.target.name,
				value     = e.target.value,
				dataValue = e.target.data;

		this.state.formData[field] = dataValue || value;

		let data = this.updateEngine();
		this.setState({ formData: data });

		this.props.onChange(this.props.key, data);
	}

	getPeriodText () {
		let text;

		this.periods.forEach((period) => {
			if (this.state.formData.period == period.value) {
				text = period.text;
			}
		});

		return text;
	}

	getInterest () {
		return this.engine.getTotalPayment() - this.engine.principal;
	}

	render () {
		return <div className="mortgage-calculator">
			<div className="row">
				<div className="form-group col-xs-12 col-sm-12 col-md-5">
					<label className="form-control-label" htmlFor="principal">Principal</label>
					<div className="input-group">
						<label className="input-group-addon" htmlFor="principal">$</label>
						<input className="form-control"
							id="principal"
							name="principal"
							onChange={ this.handleChange }
							type="text"
							value={ this.state.formData.principal }/>
					</div>
				</div>
				<div className="form-group col-xs-6 col-sm-4 col-md-2">
					<label className="form-control-label" htmlFor="interest">Interest rate</label>
					<div className="input-group">
						<FormatterInput className="form-control"
							id="interest"
							name="interest"
							onChange={ this.handleChange }
							type="text"
							format={ convert.percent }
							value={ this.state.formData.interest }/>
						<label className="input-group-addon" htmlFor="interest">%</label>
					</div>
				</div>
				<div className="form-group col-xs-6 col-sm-3 col-md-2">
					<label className="form-control-label" htmlFor="period">Repayment</label>
					<select className="form-control c-select"
						id="period"
						name="period"
						onChange={ this.handleChange }
						value={ this.state.formData.period }>
						{
							this.periods.map((period, index) => {
								return <option key={ 'periods'+ index }
									value={ period.value }>
									{ period.text }
								</option>;
							})
						}
					</select>
				</div>
				{ (!this.state.formData.changePayment) ?
					<div className="form-group col-xs-12 col-sm-5 col-md-3">
						<label className="form-control-label" htmlFor="term">Term (years)</label>
						<input className="form-control"
							id="term"
							name="term"
							onChange={ this.handleChange }
							type="text"
							value={ this.state.formData.term }/>
					</div>
					:
					<div className="form-group col-xs-12 col-sm-5 col-md-3">
						<label className="form-control-label" htmlFor="payments">{ this.getPeriodText() } payments</label>
						<input className="form-control"
							id="payments"
							name="payments"
							onChange={ this.handleChange }
							type="text"
							value={ this.state.formData.payments }/>
					</div>
				}
			</div>
			<div className="row">
				{ (!this.state.formData.changePayment) ?
					<div className="col-xs-6 col-sm-4 col-md-3">
						<label className="form-control-label">{ this.getPeriodText() } payments</label>
						<p>{ convert.currency.toView(this.state.formData.payments) }</p>
					</div>
					:
					<div className="col-xs-6 col-sm-4 col-md-3">
						<label className="form-control-label">Term (years)</label>
						<p>{ convert.decimal.toView(this.state.formData.term, 1) }</p>
					</div>
				}
				<div className="col-xs-6 col-sm-4 col-md-2">
					<label className="form-control-label">Interest Paid</label>
					<p>{ convert.currency.toView(this.getInterest()) }</p>
				</div>
			</div>
		</div>;
	}
}

MortgageCalculator.propTypes = propTypes;
MortgageCalculator.defaultProps = defaultProps;

export default MortgageCalculator;