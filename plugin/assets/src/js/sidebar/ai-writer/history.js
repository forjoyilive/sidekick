import { useState, useEffect } from '@wordpress/element';
import { Spinner, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 *
 * @param  root0
 * @param  root0.update
 * @param  root0.historyItems
 * @param  root0.historyLoading
 */
export default function History({ historyItems, historyLoading }) {
	const [history, setHistory] = useState([]);

	const populateHistory = async () => {
		displayHistory(historyItems.slice().reverse()); // Avoid mutating original array
	};

	const displayHistory = (items) => {
		setHistory(
			<ul className="fj-sidekick-history-items">
				{items.map((item, index) => {
					return (
						<li className="fj-sidekick-history-item" key={index}>
							<div className="fj-sidekick-history-item-prompt">
								{item.prompt}
							</div>
							<div className="fj-sidekick-history-item-result">
								{item.result}
							</div>
						</li>
					);
				})}
			</ul>
		);
	};

	useEffect(() => {
		populateHistory();
	}, [historyItems]);

	return (
		<PanelBody
			title={__('History', 'fj-sidekick')}
			intialOpen={false}
			className="fj-sidekick-aiwriter-history"
		>
			{historyLoading && <Spinner />}
			{!historyLoading && history}
		</PanelBody>
	);
}
