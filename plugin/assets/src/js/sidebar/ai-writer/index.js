import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Compose from './compose';
import History from './history';

/**
 *
 */
export default function AiWriter() {
	const [historyItems, setHistoryItems] = useState([]);
	const [loadingResult, setLoadingResult] = useState(false);
	const [loadingHistory, setLoadingHistory] = useState(true);

	const apiURL = fjSidekick.aiWriterRestURL; // eslint-disable-line no-undef
	const numberOfHistoryItems = 10;

	const getCurrentUser = useSelect((select) => {
		return select('core').getCurrentUser;
	}, []);

	const getEntityRecord = useSelect((select) => {
		return select('core').getEntityRecord;
	}, []);

	const { editEntityRecord, saveEditedEntityRecord } = useDispatch('core');

	// This prevents editEntityRecord from failing with an "undefined" error on its first call
	const warmUpEditEntityRecord = async () => {
		const currentUser = await getCurrentUser();
		if (getCurrentUser) {
			await getEntityRecord('root', 'user', currentUser.id, {});
			await editEntityRecord('root', 'user', currentUser.id, {});
			await saveEditedEntityRecord('root', 'user', currentUser.id);
		}
	};

	const getHistory = async () => {
		setLoadingHistory(true);
		const currentUser = await getCurrentUser();

		const updatedUserRecord = await getEntityRecord(
			'root',
			'user',
			currentUser.id
		);

		if (updatedUserRecord) {
			// On panel re-open and history refresh
			setHistoryItems(
				updatedUserRecord.meta?.fj_sidekick_history?.items || []
			);
			setLoadingHistory(false);
		} else {
			// On page load
			setHistoryItems(currentUser.meta.fj_sidekick_history.items || []);
			setLoadingHistory(false);
		}
	};

	const addHistoryItem = async (prompt, newResult, length) => {
		const currentUser = await getCurrentUser();
		const meta = (currentUser && currentUser.meta) || [];
		const history = (meta && meta.fj_sidekick_history) || [];
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
		setLoadingResult(true);

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': fjSidekick.aiWriterRestNonce, // eslint-disable-line no-undef
			},
			body: JSON.stringify({
				key: fjSidekick.requestKey, // eslint-disable-line no-undef
				prompt,
				length,
			}),
		};

		const response = await fetch(apiURL, requestOptions);
		const data = await response.json();
		const newResult = data.result
			? data.result.trim()
			: __('No result', 'fj-sidekick');

		setLoadingResult(false);

		addHistoryItem(prompt, newResult, length);
	};

	const clearHistory = async () => {
		const currentUser = await getCurrentUser();
		const meta = (currentUser && currentUser.meta) || [];
		const history = (meta && meta.fj_sidekick_history) || null;
		const newItems = [];

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
		setTimeout(() => {
			warmUpEditEntityRecord();
		}, 0);
		setTimeout(() => {
			getHistory();
		}, 1);
	}, []);

	return (
		<>
			<Compose
				historyItems={historyItems}
				loadingHistory={loadingHistory}
				loadingResult={loadingResult}
				updateHistory={updateHistory}
			/>
			<History
				historyItems={historyItems}
				loadingHistory={loadingHistory}
				clearHistory={clearHistory}
			/>
		</>
	);
}
