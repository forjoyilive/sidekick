<?php

/**
 * Load assets
 */

namespace SidekickWP;

class Assets
{

	public function __construct()
	{
		$this->init();
	}

	private function init()
	{
		add_action('enqueue_block_assets', [$this, 'enqueue_editor_assets']);
		add_action('admin_enqueue_scripts', [$this, 'enqueue_settings_assets']);
		add_action('admin_enqueue_scripts', [$this, 'set_translations'], 20, 3);
		add_action('admin_enqueue_scripts', [$this, 'send_data_to_javascript']);
	}

	public function enqueue_settings_assets()
	{
		if (isset($_GET['page']) && $_GET['page'] === 'sidekickwp') {
			wp_enqueue_style(
				'sidekickwp-settings-css',
				SIDEKICKWP_BUILD_URL . '/css/settings.css',
				array(),
				filemtime(SIDEKICKWP_BUILD_PATH . '/css/settings.css'),
				'all'
			);
		}
	}

	public function enqueue_editor_assets()
	{

		$asset_config_file = sprintf('%s/assets.php', SIDEKICKWP_BUILD_PATH);

		if (!file_exists($asset_config_file)) {
			return;
		}

		$asset_config = include_once $asset_config_file;
		if (empty($asset_config['js/editor.js'])) {
			return;
		}

		$editor_asset    = $asset_config['js/editor.js'];
		$js_dependencies = (!empty($editor_asset['dependencies'])) ? $editor_asset['dependencies'] : [];
		$version         = (!empty($editor_asset['version'])) ? $editor_asset['version'] : filemtime($asset_config_file);

		$js_dependencies[] = 'wp-i18n';

		// Theme Gutenberg blocks JS.
		if (is_admin()) {
			wp_enqueue_script(
				'sidekickwp-blocks-js',
				SIDEKICKWP_BUILD_URL . '/js/editor.js',
				$js_dependencies,
				$version,
				true
			);
		}

		// Theme Gutenberg blocks JS.
		if (is_admin()) {
			wp_enqueue_script(
				'sidekickwp-sidebar-js',
				SIDEKICKWP_BUILD_URL . '/js/sidebar.js',
				$js_dependencies,
				$version,
				true
			);
		}

		// Theme Gutenberg blocks CSS.
		$css_dependencies = [
			'wp-block-library-theme',
			'wp-block-library',
		];

		wp_enqueue_style(
			'sidekickwp-blocks-css',
			SIDEKICKWP_BUILD_URL . '/css/editor.css',
			$css_dependencies,
			filemtime(SIDEKICKWP_BUILD_PATH . '/css/editor.css'),
			'all'
		);
	}

	public function set_translations()
	{
		load_plugin_textdomain('sidekick-wp', false, SIDEKICKWP_PLUGIN_PATH . '/languages');
		wp_set_script_translations('sidekickwp-sidebar-js', SIDEKICKWP_TEXTDOMAIN, SIDEKICKWP_PLUGIN_PATH . '/languages');
	}

	public function send_data_to_javascript()
	{
		ob_start();
?>
		var sidekickWP = sidekickWP || {};
		sidekickWP.requestKey="<?php echo Modules\AIWriter::getRequestKey() ?>";
		sidekickWP.aiWriterRestURL="<?php echo rest_url('sidekickwp/v1/ai-writer/') ?>";
		sidekickWP.aiWriterRestNonce="<?php echo wp_create_nonce('wp_rest') ?>";
<?php
		$sidekickWPVars = ob_get_clean();

		wp_add_inline_script('sidekickwp-sidebar-js', $sidekickWPVars, 'before');
	}
}
