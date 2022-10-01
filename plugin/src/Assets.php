<?php

/**
 * Load assets
 */

namespace ForJoyILive\Sidekick;

class Assets
{

	public function __construct()
	{
		$this->init();
	}

	private function init()
	{
		add_action('enqueue_block_assets', [$this, 'enqueue_editor_assets']);
	}

	public function enqueue_editor_assets()
	{

		$asset_config_file = sprintf('%s/assets.php', FJ_SIDEKICK_BUILD_PATH);

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

		// Theme Gutenberg blocks JS.
		if (is_admin()) {
			wp_enqueue_script(
				'fj-sidekick-blocks-js',
				FJ_SIDEKICK_BUILD_URL . '/js/editor.js',
				$js_dependencies,
				$version,
				true
			);
		}

		// Theme Gutenberg blocks JS.
		if (is_admin()) {
			wp_enqueue_script(
				'fj-sidekick-sidebar-js',
				FJ_SIDEKICK_BUILD_URL . '/js/sidebar.js',
				$js_dependencies,
				$version,
				true
			);

			$script = 'var fjSidekick = fjSidekick || {}; fjSidekick.openai_api_key = "' . get_option('fj_sidekick_openai_api_key') . '";';

			wp_add_inline_script('fj-sidekick-sidebar-js', $script, 'before');
		}

		// Theme Gutenberg blocks CSS.
		$css_dependencies = [
			'wp-block-library-theme',
			'wp-block-library',
		];

		wp_enqueue_style(
			'fj-sidekick-blocks-css',
			FJ_SIDEKICK_BUILD_URL . '/css/editor.css',
			$css_dependencies,
			filemtime(FJ_SIDEKICK_BUILD_PATH . '/css/editor.css'),
			'all'
		);
	}
}
