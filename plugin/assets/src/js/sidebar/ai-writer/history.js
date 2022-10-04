import { useState, useEffect } from '@wordpress/element';
import { Spinner, PanelBody, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 *
 * @param  root0
 * @param  root0.update
 * @param  root0.historyItems
 * @param  root0.loadingHistory
 * @param  root0.clearHistory
 */
export default function History({
	historyItems,
	loadingHistory,
	clearHistory,
}) {
	const [history, setHistory] = useState('');

	const populateHistory = async () => {
		if (historyItems && 0 < historyItems.length) {
			displayHistory(historyItems.slice().reverse()); // Avoid mutating original array
		} else {
			setHistory('');
		}
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
			initialOpen={false}
			className="fj-sidekick-aiwriter-history"
		>
			{loadingHistory && <Spinner />}
			{!loadingHistory && (
				<>
					{!!history && history}
					{!history && (
						<p>{__('No history available.', 'fj-sidekick')}</p>
					)}
					<Button isPrimary onClick={clearHistory}>
						{__('Clear History', 'fj-sidekick')}
					</Button>
				</>
			)}
		</PanelBody>
	);
}
