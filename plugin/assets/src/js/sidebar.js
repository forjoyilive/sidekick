import { registerPlugin } from "@wordpress/plugins";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-post";
import { __ } from "@wordpress/i18n";
import { PanelBody, TextareaControl, Button, Dropdown } from "@wordpress/components";
import { withSelect, withDispatch } from "@wordpress/data";
import React from 'react';
class FJSidekickSidebar extends React.Component {    

    constructor(props) {
      super(props);
      this.state = {
        results: '',
        loading: false
        };
    }

    onButtonClick = () => {

        this.setState({loading: true});
    
        const requestOptions = {
            method: 'POST',
            headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '
                    },
            body: JSON.stringify({"model": "text-davinci-002", "prompt": this.props.prompt_metafield, "temperature": 0, "max_tokens": 256})
        };

        fetch("https://api.openai.com/v1/completions", requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    results: data.choices[0].text.trim(),
                    loading: false
                });

            });

    }

    render() {
        return (
            <>
                <PanelBody
                    title={__("AI Writer", "fj-sidekick")}
                    icon="welcome-write-blog"
                    intialOpen={ true }
                >
                    <TextareaControl 
                        value={this.props.prompt_metafield}
                        label={__("Prompt", "fj-sidekick")}
                        onChange={(value) => this.props.onMetaFieldChange(value)}
                    />
    
                    <Button 
                        isPrimary
                        onClick={this.onButtonClick}
                        style={{marginBottom: 20}}>{__("Get Content", "fj-sidekick")}</Button>
    
                    <TextareaControl 
                        value={this.state.results}
                        label={__("Result", "fj-sidekick")}
                        style={{
                            height: 200,
                            backgroundColor: this.state.loading ? 'blue' : 'rgba(0, 0, 0, 0)'
                        }}
                    />
    
                </PanelBody>
            </>
        );
    }
	
}

FJSidekickSidebar = withSelect(
	(select) => {
		return {
			prompt_metafield: select('core/editor').getEditedPostAttribute('meta')['_fj_sidekick_prompt_metafield']
		}
	}
)(FJSidekickSidebar);

FJSidekickSidebar = withDispatch(
	(dispatch) => {
		return {
			onMetaFieldChange: (value) => {
				dispatch('core/editor').editPost({meta: {_fj_sidekick_prompt_metafield: value}})
			}
		}
	}
)(FJSidekickSidebar);

registerPlugin( 'fj-sidekick-sidebar', {
	icon: 'format-aside',
	render: () => {
		return (
			<>
				<PluginSidebarMoreMenuItem
					target="fj-sidekick-sidebar"
				>
					{__('Sidekick', 'fj-sidekick')}
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="fj-sidekick-sidebar"
					title={__('Sidekick', 'fj-sidekick')}
				>
					<FJSidekickSidebar />
				</PluginSidebar>
			</>
		)
	}
})