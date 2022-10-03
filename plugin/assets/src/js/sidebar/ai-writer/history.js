import { useState } from '@wordpress/element';
import { Spinner, Panel, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 *
 */
export default function History() {
	const [loading, setLoading] = useState(true);

	return (
		<PanelBody
			title={__('History', 'fj-sidekick')}
			intialOpen={false}
			className="fj-sidekick-aiwriter-history"
		>
			{loading && <Spinner />}
		</PanelBody>
	);
}
