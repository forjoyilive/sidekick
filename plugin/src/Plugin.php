<?php

/**
 * Load the plugin
 */

namespace ForJoyILive\Sidekick;

class Plugin
{

    public function __construct()
    {
        $this->init();
    }

    private function init()
    {
        define('FJ_SIDEKICK_TEXTDOMAIN', 'fj-sidekick');
        define('FJ_SIDEKICK_PLUGIN_PATH', untrailingslashit(plugin_dir_path(__DIR__))); // One level up
        define('FJ_SIDEKICK_PLUGIN_URL', untrailingslashit(plugin_dir_url(__DIR__))); // One level up
        define('FJ_SIDEKICK_BUILD_PATH', FJ_SIDEKICK_PLUGIN_PATH . '/assets/build');
        define('FJ_SIDEKICK_BUILD_URL', FJ_SIDEKICK_PLUGIN_URL . '/assets/build');

        new Assets();
        new Modules\AIWriter();
        new Settings();
        new Meta();
    }
}
