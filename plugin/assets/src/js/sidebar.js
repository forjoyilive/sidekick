import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import SidekickWPLogo from './s-logo';
import AIWriter from './sidebar/ai-writer';

// The icon SVG had to be pasted here, the import would crash when the Sidekick sidebar
// was closed but the kabab menu was opened
const logo = (
	<svg viewBox="0 0 1133.8533 1133.8533" width="20" height="20">
		<defs id="defs6" />
		<g
			transform="matrix(1.4856965,0,0,-1.4856965,-62.381837,1201.0396)"
			id="g10"
		>
			<g transform="scale(0.1)" id="g12">
				<path
					id="path22"
					style={{
						fill: 'none',
						stroke: '#231f20',
						strokeWidth: 10,
						strokeLinecap: 'butt',
						strokeLinejoin: 'miter',
						strokeMiterlimit: 4,
						strokeDasharray: 'none',
						strokeOpacity: 1,
					}}
					d="M 8503.9,0 H 0 v 8503.9 h 8503.9 z"
				/>
				<path
					id="path24"
					style={{
						fill: '#231f20',
						fillOpacity: 1,
						fillRule: 'nonzero',
						stroke: 'none',
						strokeWidth: 1.83441,
					}}
					d="m 2781.6698,1990.5261 h 387.4264 c 79.6683,-286.9745 172.9294,-546.0841 279.8202,-777.2559 86.4372,-187.2011 195.7861,-364.20287 327.2213,-531.50066 168.1783,-24.06734 340.0069,-36.76143 514.8441,-36.76143 823.703,0 1582.7249,276.49979 2189.7113,741.46659 -32.7808,178.9463 -101.8829,349.2342 -207.3795,510.7535 -153.0628,234.4003 -381.0794,412.0992 -683.9763,533.3533 -207.3246,82.8785 -444.825,174.562 -712.6848,275.0141 -267.8416,100.4521 -499.0867,195.2908 -693.552,284.5896 -382.6387,172.1957 -680.014,397.7541 -892.0347,676.8038 -212.0939,278.9949 -318.0675,643.326 -318.0675,1092.9387 0,258.2844 52.6108,499.0134 157.8322,722.2422 105.2215,223.1553 255.0741,422.4818 449.6128,597.8877 184.8897,165.7568 403.349,295.7245 655.2862,389.8111 251.8456,94.0133 514.9176,141.1025 789.1978,141.1025 312.4727,0 592.2745,-47.823 839.4423,-143.4872 247.0761,-95.6642 472.6896,-207.3246 676.7855,-334.8157 l 196.1163,325.2585 H 7119.91 l 38.2657,-2252.8333 h -387.4264 c -70.166,258.2843 -149.1005,505.3604 -236.7484,741.3749 -87.758,235.9413 -201.7111,449.6129 -342.0065,640.9229 -137.1217,184.9081 -304.5297,332.431 -502.2235,442.4403 -197.7489,110.0093 -440.0372,165.0231 -727.0298,165.0231 -302.9704,0 -561.2547,-97.3153 -774.8529,-291.7805 -213.6714,-194.5388 -320.4705,-432.1126 -320.4705,-712.6666 0,-293.413 68.5334,-536.5267 205.6734,-729.4145 137.0668,-192.9794 336.375,-351.5638 597.8877,-475.9181 232.7311,-111.6602 461.5548,-208.0583 686.3795,-289.3775 224.7881,-81.3192 442.4219,-168.2333 652.8833,-260.6873 191.3285,-82.9519 375.466,-176.9651 552.4495,-282.1866 176.965,-105.2398 330.7799,-228.035 461.5546,-368.2936 132.5725,-147.3577 232.7127,-307.7398 301.3378,-480.8709 360.6258,561.2545 569.8397,1229.0698 569.8397,1945.772 0,1990.66 -1613.7631,3604.4231 -3604.4414,3604.4231 -1990.6599,0 -3604.40466,-1613.7631 -3604.40466,-3604.4231 0,-1463.3418 872.02126,-2722.9546 2124.71836,-3287.6395 l -29.6257,1028.7345"
				/>
			</g>
		</g>
	</svg>
);

registerPlugin('sidekickwp-sidebar', {
	icon: SidekickWPLogo,
	render: () => {
		return (
			<>
				<PluginSidebarMoreMenuItem
					target="sidekickwp-sidebar"
					icon={logo}
				>
					{__('Sidekick WP', 'sidekick-wp')}
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="sidekickwp-sidebar"
					title={__('Sidekick WP', 'sidekick-wp')}
					icon={SidekickWPLogo}
					className="sidekickwp-sidebar"
				>
					<TabPanel
						className="sidekickwp-tab-panel"
						activeClass="active-tab"
						tabs={[
							{
								name: 'sidekickwp-ai-writer',
								title: __('AI Writer', 'sidekick-wp'),
								className: 'sidekickwp-aiwriter',
								component: <AIWriter />,
							},
						]}
					>
						{(tab) => {
							return tab.component;
						}}
					</TabPanel>
				</PluginSidebar>
			</>
		);
	},
});
