import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	TextareaControl,
	Button,
	RangeControl,
	Spinner,
	Icon,
	__experimentalDivider as Divider,
} from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import React from 'react';
import SidekickLogo from './s-logo';

/**
 *
 * @param  props
 */
function FJSidekickSidebar(props) {
	const [loading, setLoading] = useState(false);
	const [prompt, setPrompt] = useState('');
	const [result, setResult] = useState('');
	const [length, setLength] = useState(150);

	const apiKey = fjSidekick.openaiApiKey;
	const apiURL = 'https://api.openai.com/v1/completions';

	const getCurrentUser = useSelect((select) => {
		return select('core').getCurrentUser;
	}, []);

	const { editEntityRecord, saveEditedEntityRecord } = useDispatch('core');

	const setInitialState = async () => {
		const currentUser = await getCurrentUser();
		const lastIndex = currentUser.meta.fj_sidekick_history.items.length - 1;
		const lastItem = currentUser.meta.fj_sidekick_history.items[lastIndex];

		if (lastItem) {
			setPrompt(lastItem.prompt);
			setResult(lastItem.result);
			setLength(lastItem.length);
		}
	};

	// This prevents editEntityRecord from failing with an "undefined" error on its first call
	const warmUpEditEntityRecord = async () => {
		await getCurrentUser();
		await editEntityRecord('root', 'user', 1, {});
		await saveEditedEntityRecord('root', 'user', 1);
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
		setLoading(true);

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
		setLoading(false);

		addHistoryItem(newResult);
	};

	useEffect(async () => {
		warmUpEditEntityRecord();
		setTimeout(() => setInitialState(), 50);
	}, []);

	return (
		<>
			<PanelBody
				title={__('AI Writer', 'fj-sidekick')}
				icon="welcome-write-blog"
				intialOpen={true}
			>
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
					disabled={loading}
				>
					{__('Get Content', 'fj-sidekick')}
				</Button>

				{loading && <Spinner />}

				{result && !loading && (
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
			</PanelBody>
		</>
	);
}

registerPlugin('fj-sidekick-sidebar', {
	icon: SidekickLogo,
	render: () => {
		return (
			<>
				<PluginSidebarMoreMenuItem target="fj-sidekick-sidebar">
					{__('Sidekick', 'fj-sidekick')}
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="fj-sidekick-sidebar"
					title={__('Sidekick', 'fj-sidekick')}
				>
					<FJSidekickSidebar />
				</PluginSidebar>
			</>
		);
	},
});
