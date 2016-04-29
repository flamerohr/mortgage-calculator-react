import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';

function setupMortgage () {
	let $mortgages = window.document.getElementsByClassName('react-mortgage');

	for (let i = 0; i < $mortgages.length; i++) {
		let $mortgage = $mortgages[i];

		buildMortgage($mortgage);
	}
}
export default setupMortgage;

function buildMortgage ($mortgage) {
	ReactDOM.render(
		<App />,
		$mortgage
	);
}

setupMortgage();