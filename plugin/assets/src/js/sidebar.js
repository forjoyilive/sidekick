import { registerPlugin } from "@wordpress/plugins";
import { PluginSidebar, PluginSidebarMoreMenuItem } from "@wordpress/edit-post";
import { __ } from "@wordpress/i18n";
import { PanelBody, TextareaControl, Button, Dropdown } from "@wordpress/components";
import { withSelect, withDispatch } from "@wordpress/data";

let PluginMetaFields = (props) => {

	return (
		<>
			<PanelBody
				title={__("AI Writer", "fj-sidekick")}
				icon="welcome-write-blog"
				intialOpen={ true }
			>
				<TextareaControl 
					value={props.prompt_metafield}
					label={__("Prompt", "fj-sidekick")}
					onChange={(value) => props.onMetaFieldChange(value)}
				/>

                <Button 
                    isPrimary
                    onClick={onGetContent}
                    style={{marginBottom: 20}}>{__("Get Content", "fj-sidekick")}</Button>

				<TextareaControl 
					value={props.result_metafield}
					label={__("Result", "fj-sidekick")}
                    style={{height: 200}}
					onChange={(value) => props.onMetaFieldChange(value)}
				/>

			</PanelBody>
		</>
	)
}

const onGetContent = () => {
    alert('test');
}

PluginMetaFields = withSelect(
	(select) => {
		return {
			prompt_metafield: select('core/editor').getEditedPostAttribute('meta')['_fj_sidekick_prompt_metafield']
		}
	}
)(PluginMetaFields);

PluginMetaFields = withDispatch(
	(dispatch) => {
		return {
			onMetaFieldChange: (value) => {
				dispatch('core/editor').editPost({meta: {_fj_sidekick_prompt_metafield: value}})
			}
		}
	}
)(PluginMetaFields);

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
					<PluginMetaFields />
				</PluginSidebar>
			</>
		)
	}
})