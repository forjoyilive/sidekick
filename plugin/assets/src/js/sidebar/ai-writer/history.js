import { useState, useEffect } from '@wordpress/element';
import { Spinner, PanelBody, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * History panel
 *
 * @param {Object}   props
 * @param {array}    props.historyItems
 * @param {boolean}  props.loadingHistory
 * @param {function} props.clearHistory
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
			<ul className="sidekickwp-history-items">
				{items.map((item, index) => {
					return (
						<li className="sidekickwp-history-item" key={index}>
							<div className="sidekickwp-history-item-prompt">
								{item.prompt}
							</div>
							<div className="sidekickwp-history-item-result">
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
			title={__('History', 'sidekick-wp')}
			initialOpen={false}
			className="sidekickwp-aiwriter-history"
		>
			{loadingHistory && <Spinner />}
			{!loadingHistory && (
				<>
					{!!history && (
						<>
							{history}
							<Button isPrimary onClick={clearHistory}>
								{__('Clear History', 'sidekick-wp')}
							</Button>
						</>
					)}
					{!history && (
						<p>{__('No history available.', 'sidekick-wp')}</p>
					)}
				</>
			)}
		</PanelBody>
	);
}
