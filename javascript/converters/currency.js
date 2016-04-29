import DecimalValueConverter from './decimal';

export default class CurrencyValueConverter {
	constructor () {
		this.decimal = new DecimalValueConverter;
	}

	toView (decimal) {
		return '$' + this.decimal.toView(decimal);
	}

	fromView (dollar) {
		return this.decimal.fromView(dollar).replace(/^\$/g, '');
	}
}