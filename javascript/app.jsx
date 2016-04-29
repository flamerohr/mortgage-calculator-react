import React from 'react';
import MortgageCalculator from './mortgage-calculator';
import DefaultData from './constants/default-data';

import CurrencyValueConverter from './converters/currency';

const convert = {
	currency: new CurrencyValueConverter
};

const propTypes = {};

const defaultProps = {};

const functions = [
	'updateMortgage',
	'addMortgage',
	'toggleMortgagePayment'
];

class App extends React.Component {
	constructor (props) {
		super(props);

		this.init(props);

		functions.forEach((func) => {
			this[func] = this[func].bind(this);
		});
	}

	init () {
		if (!this.state) {
			this.state = Object.assign({
				mortgages: []
			}, DefaultData);
		}
		if (!this.count) {
			this.count = 0;
		}
	}

	componentDidMount () {
		if (!this.state.mortgages.length) {
			this.addMortgage();
		}
	}

	addMortgage () {
		let newMortgage = {
			key:       this.count,
			show:      true,
			principal: this.state.principalDefault || undefined,
			interest:  this.state.interestDefault || undefined,
			term:      this.state.termDefault || undefined,
			period:    this.state.periodDefault || undefined,
			payments:  this.state.paymentsDefault || undefined
		};

		this.state.mortgages.push(newMortgage);
		this.count++;
		this.setState(this.state);
	}

	updateMortgage (key, formData) {
		this.state.mortgages[key] = formData;
		this.setState(this.state);
	}

	removeMortgage (key) {
		let index = this.getMortgage(key),
				removedMortgage;

		if (typeof index !== 'undefined') {
			removedMortgage = this.state.mortgages.splice(index, 1);
			this.setState(this.state);
		}

		return removedMortgage;
	}

	toggleMortgage (key) {
		let index = this.getMortgage(key),
				mortgage;

		if (typeof index !== 'undefined') {
			mortgage = this.state.mortgages[index];
			mortgage.show = !mortgage.show;
			this.setState(this.state);
		}
	}

	getMortgage (key) {
		let index;

		this.state.mortgages.forEach((mortgage, pos) => {
			if (mortgage.key === key) {
				index = pos;
			}
		});

		return index;
	}

	getTotalPrincipal () {
		let total = 0;

		this.state.mortgages.forEach((mortgage) => {
			total += (1 * mortgage.principal);
		});

		return total;
	}

	getTotalInterest () {
		let total = 0;

		this.state.mortgages.forEach((mortgage) => {
			let viewmodel = this.refs['mortgage-' + mortgage.key];
			if (viewmodel) {
				total += (1 * viewmodel.getInterest());
			}
		});

		return total;
	}

	toggleMortgagePayment (key) {
		let index = this.getMortgage(key),
				mortgage;

		if (typeof index !== 'undefined') {
			mortgage = this.state.mortgages[index];
			mortgage.changePayment = !mortgage.changePayment;
			this.setState(this.state);
		}
	}

	render () {
		return <div className="mortgage-container">
			<div className="card">
				<div className="card-header">
					<div className="card-title">Mortgage summary</div>
				</div>
				<div className="card-block">
					<div className="form-group row">
						<div className="col-sm-6">
							<label className="form-control-label">Total principal</label>
							<div>{ convert.currency.toView(this.getTotalPrincipal()) }</div>
						</div>
						<div className="col-sm-6">
							<label className="form-control-label">Total interest paid</label>
							<div>{ convert.currency.toView(this.getTotalInterest()) }</div>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-12">
							<button className="btn btn-success"
								onClick={ this.addMortgage }>
								Add new mortgage
							</button>
						</div>
					</div>
				</div>
			</div>
			{ this.state.mortgages.map((mortgage) => {
				return <div className="card" key={ 'mortgage-'+ mortgage.key }>
					<div className="card-header">
						<div className="card-title">
							Mortgage { mortgage.key + 1 }
							<small className="m-l-2">{ convert.currency.toView(mortgage.principal) }</small>
						</div>
					</div>
					<div className="card-block card-title-actions">
						<a className="card-link"
							href="javascript:void(0)"
							onClick={ this.toggleMortgage.bind(this, mortgage.key) }>
							{ (mortgage.show) ? 'Hide' : 'Show' }
						</a>
						{ (this.state.mortgages.length > 1) ?
							<a className="card-link"
								href="javascript:void(0)"
								onClick={ this.removeMortgage.bind(this, mortgage.key) }>
								Remove
							</a>
							:
							null
						}
						{ (mortgage.show) ?
							<a className="card-link"
								href="javascript:void(0)"
								onClick={ this.toggleMortgagePayment.bind(this, mortgage.key) }>
								{ (mortgage.changePayment) ? 'Set term' : 'Set payments' }
							</a>
							:
							null
						}
					</div>
					<div className="card-block" style={ (mortgage.show) ? null : { display: 'none' } }>
						<MortgageCalculator formData={ mortgage }
							key={ mortgage.key }
							onChange={ this.updateMortgage }
							ref={ 'mortgage-' + mortgage.key }></MortgageCalculator>
					</div>
				</div>;
			}) }
		</div>;
	}

}
App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
