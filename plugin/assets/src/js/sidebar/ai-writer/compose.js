import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch, subscribe } from '@wordpress/data';
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
import React from 'react';

/**
 *
 * @param  props
 */
export default function Compose() {
	const [loading, setLoading] = useState(true);
	const [loadingResult, setLoadingResult] = useState(false);
	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [length, setLength] = useState(150);

	const apiKey = fjSidekick.openaiApiKey; // eslint-disable-line no-undef
	const apiURL = 'https://api.openai.com/v1/completions';

	const isResolving = useSelect((select) => {
		return select('core/data').isResolving;
	}, []);

	const getCurrentUser = useSelect((select) => {
		return select('core').getCurrentUser;
	}, []);

	const { editEntityRecord, saveEditedEntityRecord } = useDispatch('core');

	// This prevents editEntityRecord from failing with an "undefined" error on its first call
	const warmUpEditEntityRecord = async () => {
		await editEntityRecord('root', 'user', 1, {});
		await saveEditedEntityRecord('root', 'user', 1);
	};

	const setInitialState = () => {
		const currentUser = getCurrentUser();

		const unsubscribe = subscribe(() => {
			const isResolvingCurrentUser = isResolving(
				'core',
				'getCurrentUser'
			);
			if (!isResolvingCurrentUser) {
				unsubscribe();
				const lastIndex =
					currentUser.meta.fj_sidekick_history.items.length - 1;
				const lastItem =
					currentUser.meta.fj_sidekick_history.items[lastIndex];

				if (lastItem) {
					setPrompt(lastItem.prompt);
					setResult(lastItem.result);
					setLength(lastItem.length);
				}

				setLoading(false);
			}
		});
	};

	const addHistoryItem = async (newResult) => {
		const currentUser = await getCurrentUser();
		const meta = (currentUser && currentUser.meta) || [];
		const history = (meta && meta.fj_sidekick_history) || null;
		const items = (history && history.items) || [];
		const newItems = [...items, { prompt, result: newResult, length }];
		const newMeta = {
			...meta,
			fj_sidekick_history: {
				...history,
				items: newItems,
			},
		};

		await editEntityRecord('root', 'user', currentUser.id, {
			meta: newMeta,
		});
		await saveEditedEntityRecord('root', 'user', currentUser.id);
	};

	const onButtonClick = async () => {
		setLoadingResult(true);

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + apiKey,
			},
			body: JSON.stringify({
				model: 'text-davinci-002',
				prompt,
				temperature: 0,
				max_tokens: length,
			}),
		};

		const response = await fetch(apiURL, requestOptions);
		const data = await response.json();
		const newResult =
			data && data.choices && data.choices[0]
				? data.choices[0].text.trim()
				: __('No result', 'fj-sidekick');

		setResult(newResult);
		setLoadingResult(false);

		addHistoryItem(newResult);
	};

	useEffect(() => {
		warmUpEditEntityRecord();
		setTimeout(() => setInitialState(), 0); // setTimeout is required, not sure why
	}, []);

	return (
		<>
			<PanelBody
				title={__('Compose', 'fj-sidekick')}
				icon="welcome-write-blog"
				className="fj-sidekick-aiwriter-compose"
				intialOpen={true}
			>
				{loading && <Spinner />}
				{!loading && (
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
							onClick={onButtonClick}
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
