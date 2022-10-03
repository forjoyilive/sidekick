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
 * @param  props.historyLoading
 * @param  props.updateHistory
 * @param  props.resultLoading
 */
export default function Compose({
	historyItems,
	historyLoading,
	updateHistory,
	resultLoading,
}) {
	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [length, setLength] = useState(150);

	const restoreStateFromHistory = () => {
		const lastIndex = historyItems.length - 1;
		const lastItem = historyItems[lastIndex];

		// If history was cleared, don't delete what's currently there
		if (lastItem) {
			setPrompt(lastItem.prompt);
			setResult(lastItem.result);
			setLength(lastItem.length);
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
				{historyLoading && <Spinner />}
				{!historyLoading && (
					<div>
						<TextareaControl
							value={prompt}
							label={__('Prompt', 'fj-sidekick')}
							onChange={(value) => setPrompt(value)}
						/>

						<RangeControl
							label={__('Length', 'fj-sidekick')}
							min={10}
							max={250}
							value={length}
							onChange={(value) => setLength(value)}
						/>

						<Button
							isPrimary
							onClick={() => updateHistory(prompt, length)}
							style={{ marginBottom: 20 }}
							disabled={resultLoading}
						>
							{__('Get Content', 'fj-sidekick')}
						</Button>

						{resultLoading && <Spinner />}

						{result && !resultLoading && (
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
