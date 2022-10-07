import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextareaControl,
	Button,
	RangeControl,
	Spinner,
	Icon,
	__experimentalDivider as Divider, // eslint-disable-line
} from '@wordpress/components';

/**
 *
 * @param  props
 * @param  props.refreshHistory
 * @param  props.historyItems
 * @param  props.loadingHistory
 * @param  props.updateHistory
 * @param  props.loadingResult
 */
export default function Compose({
	historyItems,
	loadingHistory,
	updateHistory,
	loadingResult,
}) {
	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [length, setLength] = useState(150);

	const restoreStateFromHistory = () => {
		if (historyItems && 0 < historyItems.length) {
			const lastIndex = historyItems.length - 1;
			const lastItem = historyItems[lastIndex];

			// If history was cleared, don't delete what's currently there
			if (lastItem) {
				setPrompt(lastItem.prompt);
				setResult(lastItem.result);
				setLength(lastItem.length);
			}
		}
	};

	useEffect(() => {
		restoreStateFromHistory();
	}, [historyItems]);

	return (
		<>
			<PanelBody
				title={__('Compose', 'fj-sidekick')}
				icon="welcome-write-blog"
				className="fj-sidekick-aiwriter-compose"
				initialOpen={true}
			>
				{loadingHistory && <Spinner />}
				{!loadingHistory && (
					<div>
						<TextareaControl
							value={prompt}
							label={__('Prompt', 'fj-sidekick')}
							onChange={(value) => setPrompt(value)}
						/>

						<RangeControl
							label={__('Length', 'fj-sidekick')}
							min={10}
							max={500}
							value={length}
							onChange={(value) => setLength(value)}
						/>

						<Button
							isPrimary
							onClick={() => updateHistory(prompt, length)}
							style={{ marginBottom: 20 }}
							disabled={loadingResult}
						>
							{__('Get Content', 'fj-sidekick')}
						</Button>

						{loadingResult && <Spinner />}

						{result && !loadingResult && (
							<>
								<Divider />
								<TextareaControl
									value={result}
									label={__('Result', 'fj-sidekick')}
									style={{
										height: 300,
									}}
									onClick={(e) => e.target.select()}
								/>
								<Button
									onClick={() =>
										navigator.clipboard.writeText(result)
									}
									className="fj-sidekick-copy-button"
								>
									<Icon icon="admin-page" />
									{__('Copy to Clipboard', 'fj-sidekick')}
								</Button>
							</>
						)}
					</div>
				)}
			</PanelBody>
		</>
	);
}
