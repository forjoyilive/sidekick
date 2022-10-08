<?php

/**
 * Sidekick WP
 * 
 * @package sidekick-wp
 * @author Nabha Cosley
 * 
 * @wordpress-plugin
 * 
 * Plugin Name:       Sidekick WP
 * Plugin URI:        https://github.com/forjoyilive/sidekickwp/
 * Description:       Helping you get more done, more easily.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Author:            Nabha Cosley
 * Author URI:        https://forjoyi.live/
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Update URI:        https://github.com/forjoyilive/sidekickwp/
 * Text Domain:       sidekick-wp
 * Domain Path:       /languages
 */
define('SIDEKICKWP_VERSION', '1.0.0');

require_once('vendor/autoload.php');

use SidekickWP\Plugin;

if (class_exists('SidekickWP\Plugin')) {
    $the_plugin = new Plugin();
}
