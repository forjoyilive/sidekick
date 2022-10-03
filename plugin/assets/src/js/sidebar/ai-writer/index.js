import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch, subscribe } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Compose from './compose';
import History from './history';

/**
 *
 */
export default function AiWriter() {
	const [historyItems, setHistoryItems] = useState([]);
	const [resultLoading, setResultLoading] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(true);

	const apiKey = fjSidekick.openaiApiKey; // eslint-disable-line no-undef
	const apiURL = 'https://api.openai.com/v1/completions';
	const numberOfHistoryItems = 10;

	const isResolving = useSelect((select) => {
		return select('core/data').isResolving;
	}, []);

	const getCurrentUser = useSelect((select) => {
		return select('core').getCurrentUser;
	}, []);

	const getEntityRecord = useSelect((select) => {
		return select('core').getEntityRecord;
	}, []);

	const { editEntityRecord, saveEditedEntityRecord } = useDispatch('core');

	// This prevents editEntityRecord from failing with an "undefined" error on its first call
	const warmUpEditEntityRecord = async () => {
		await getEntityRecord('root', 'user', 1, {});
		await editEntityRecord('root', 'user', 1, {});
		await saveEditedEntityRecord('root', 'user', 1);
	};

	const getHistory = async () => {
		setHistoryLoading(true);
		const currentUser = await getCurrentUser();

		const updatedUserRecord = await getEntityRecord(
			'root',
			'user',
			currentUser.id
		);

		if (updatedUserRecord) {
			// On panel re-open and history refresh
			setHistoryItems(updatedUserRecord.meta?.fj_sidekick_history?.items);
			setHistoryLoading(false);
		} else {
			// On page load
			const unsubscribe = subscribe(() => {
				const isResolvingCurrentUser = isResolving(
					'core',
					'getCurrentUser'
				);
				if (!isResolvingCurrentUser) {
					unsubscribe();

					setHistoryItems(currentUser.meta.fj_sidekick_history.items);
					setHistoryLoading(false);
				}
			});
		}
	};

	const addHistoryItem = async (prompt, newResult, length) => {
		const currentUser = await getCurrentUser();
		const meta = (currentUser && currentUser.meta) || [];
		const history = (meta && meta.fj_sidekick_history) || null;
		const items = (history && history.items) || [];
		const newItems = [...items, { prompt, result: newResult, length }];

		while (numberOfHistoryItems < newItems.length) {
			newItems.shift();
		}

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

		getHistory();
	};

	const updateHistory = async (prompt, length) => {
		setResultLoading(true);

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

		setResultLoading(false);

		addHistoryItem(prompt, newResult, length);
	};

	const clearHistory = async () => {
		const currentUser = await getCurrentUser();
		const meta = (currentUser && currentUser.meta) || [];
		const history = (meta && meta.fj_sidekick_history) || null;
		const newItems = [];

		while (numberOfHistoryItems < newItems.length) {
			newItems.shift();
		}

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

		getHistory();
	};

	useEffect(() => {
		warmUpEditEntityRecord();
		setTimeout(() => {
			getHistory();
		}, 0);
	}, []);

	return (
		<>
			<Compose
				historyItems={historyItems}
				historyLoading={historyLoading}
				updateHistory={updateHistory}
				resultLoading={resultLoading}
			/>
			<History
				historyItems={historyItems}
				historyLoading={historyLoading}
				clearHistory={clearHistory}
			/>
		</>
	);
}
