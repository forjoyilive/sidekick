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

class FJSidekickSidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			apiKey: fjSidekick.openaiApiKey,
			prompt: '',
			result: '',
			length: 150,
		};
	}

	async componentDidMount() {
		await this.warmUpEditEntityRecord();

		// Not sure how to get this to work without setTimeout, getCurrentUser() seems to need it
		setTimeout(() => {
			this.setInitialState();
		}, 50);
	}

	setInitialState = async () => {
		const user = await this.props.getCurrentUser();
		const lastIndex = user.meta.fj_sidekick_history.items.length - 1;
		const lastItem = user.meta.fj_sidekick_history.items[lastIndex];

		if (lastItem) {
			this.setState({
				prompt: lastItem.prompt,
				result: lastItem.result,
				length: lastItem.length,
			});
		}
	};

	// This prevents editEntityRecord from failing with an "undefined" error on its first call
	warmUpEditEntityRecord = async () => {
		await this.props.getCurrentUser();
		await this.props.editEntityRecord('root', 'user', 1, {});
		await this.props.saveEditedEntityRecord('root', 'user', 1);
	};

	onButtonClick = () => {
		this.warmUpEditEntityRecord();

		this.setState({ loading: true });

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.state.apiKey,
			},
			body: JSON.stringify({
				model: 'text-davinci-002',
				prompt: this.state.prompt,
				temperature: 0,
				max_tokens: this.state.length,
				// top_p: 1,
				// frequency_penalty: 0,
				// presence_penalty: 0,
			}),
		};

		fetch('https://api.openai.com/v1/completions', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				const result =
					data && data.choices && data.choices[0]
						? data.choices[0].text.trim()
						: '';

				this.setState({ result });
				this.setState({ loading: false });

				this.updatePrompt(this.state.prompt);
				this.addHistoryItem(this.state.prompt, result);
			});
	};

	updatePrompt = async (prompt) => {
		const user = await this.props.getCurrentUser();

		const currentHistory =
			(user && user.meta && user.meta.fj_sidekick_history) || [];
		const currentMeta = (user && user.meta) || [];

		const meta = {
			...currentMeta,
			fj_sidekick_history: { ...currentHistory, last_prompt: prompt },
		};

		await this.props.editEntityRecord('root', 'user', user.id, {
			meta,
		});
		await this.props.saveEditedEntityRecord('root', 'user', user.id);
	};

	addHistoryItem = async (prompt, result) => {
		try {
			const user = await this.props.getCurrentUser();
			const currentItems =
				(user &&
					user.meta &&
					user.meta.fj_sidekick_history &&
					user.meta.fj_sidekick_history.items) ||
				[];
			const currentMeta = (user && user.meta) || [];
			const items = [
				...currentItems,
				{ prompt, result, length: this.state.length },
			];
			const meta = {
				...currentMeta,
				fj_sidekick_history: {
					items,
				},
			};
			await this.props.editEntityRecord('root', 'user', user.id, {
				meta,
			});
			await this.props.saveEditedEntityRecord('root', 'user', user.id);
		} catch (error) {
			console.log('There was an error saving the history item.', error);
		}
	};

	render() {
		return (
			<>
				<PanelBody
					title={__('AI Writer', 'fj-sidekick')}
					icon="welcome-write-blog"
					intialOpen={true}
				>
					<TextareaControl
						value={this.state.prompt}
						label={__('Prompt', 'fj-sidekick')}
						onChange={(value) => this.setState({ prompt: value })}
					/>

					<RangeControl
						label={__('Length', 'fj-sidekick')}
						min={10}
						max={250}
						value={this.state.length ? this.state.length : 150}
						onChange={(value) => this.setState({ length: value })}
					/>

					<Button
						isPrimary
						onClick={this.onButtonClick}
						style={{ marginBottom: 20 }}
						disabled={this.state.loading}
					>
						{__('Get Content', 'fj-sidekick')}
					</Button>

					{this.state.loading && <Spinner />}

					{this.state.result && !this.state.loading && (
						<>
							<Divider />
							<TextareaControl
								value={this.state.result}
								label={__('Result', 'fj-sidekick')}
								style={{
									height: 300,
								}}
								onClick={(e) => e.target.select()}
							/>
							<Button
								onClick={() =>
									navigator.clipboard.writeText(
										this.state.result
									)
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
}

FJSidekickSidebar = withSelect((select) => {
	return {
		getCurrentUser: select('core').getCurrentUser,
		getEntityRecord: select('core').getEntityRecord,
	};
})(FJSidekickSidebar);

FJSidekickSidebar = withDispatch((dispatch) => {
	return {
		editEntityRecord: dispatch('core').editEntityRecord,
		saveEditedEntityRecord: dispatch('core').saveEditedEntityRecord,
	};
})(FJSidekickSidebar);

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
