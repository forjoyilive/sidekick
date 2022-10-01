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
			results: '',
			loading: false,
			apiKey: fjSidekick.openaiApiKey,
			length: 150,
		};
	}

	onButtonClick = () => {
		this.setState({ loading: true });

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.state.apiKey,
			},
			body: JSON.stringify({
				model: 'text-davinci-002',
				prompt: this.props.prompt_metafield,
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
				const results =
					data && data.choices && data.choices[0]
						? data.choices[0].text.trim()
						: '';

				this.setState({
					results,
					loading: false,
				});
			});
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
						value={this.props.prompt_metafield}
						label={__('Prompt', 'fj-sidekick')}
						onChange={(value) =>
							this.props.onMetaFieldChange(value)
						}
					/>

					<RangeControl
						label={__('Length', 'fj-sidekick')}
						min={10}
						max={250}
						value={this.state.length}
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

					{this.state.results && !this.state.loading && (
						<>
							<Divider />
							<TextareaControl
								value={this.state.results}
								label={__('Result', 'fj-sidekick')}
								style={{
									height: 300,
								}}
							/>
							<Button
								onClick={() =>
									navigator.clipboard.writeText(
										this.state.results
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
		prompt_metafield:
			select('core/editor').getEditedPostAttribute('meta')
				._fj_sidekick_prompt_metafield,
	};
})(FJSidekickSidebar);

FJSidekickSidebar = withDispatch((dispatch) => {
	return {
		onMetaFieldChange: (value) => {
			dispatch('core/editor').editPost({
				meta: { _fj_sidekick_prompt_metafield: value },
			});
		},
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
