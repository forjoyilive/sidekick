<?php

/**
 * Load the plugin
 */

namespace SidekickWP;

class Plugin
{

    public function __construct()
    {
        $this->init();
    }

    private function init()
    {
        define('SIDEKICKWP_TEXTDOMAIN', 'sidekick-wp');
        define('SIDEKICKWP_PLUGIN_PATH', untrailingslashit(plugin_dir_path(__DIR__))); // One level up
        define('SIDEKICKWP_PLUGIN_URL', untrailingslashit(plugin_dir_url(__DIR__))); // One level up
        define('SIDEKICKWP_BUILD_PATH', SIDEKICKWP_PLUGIN_PATH . '/assets/build');
        define('SIDEKICKWP_BUILD_URL', SIDEKICKWP_PLUGIN_URL . '/assets/build');

        new Assets();
        new Modules\AIWriter();
        new Settings();
        new Meta();
    }
}
