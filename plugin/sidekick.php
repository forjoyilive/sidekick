<?php

/**
 * Sidekick Plugin
 * 
 * @package sidekick
 * @author Nabha Cosley
 * 
 * @wordpress-plugin
 * 
 * Plugin Name:       Sidekick
 * Plugin URI:        https://github.com/forjoyilive/sidekick/
 * Description:       Helping you get more done, more easily.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.2
 * Author:            Nabha Cosley
 * Author URI:        https://forjoyi.live/
 * License:           GPL v3 or later
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Update URI:        https://github.com/forjoyilive/sidekick/
 * Text Domain:       fj-sidekick
 * Domain Path:       /languages
 */

define('FJ_SIDEKICK_VERSION', '1.0.0');

require_once('vendor/autoload.php');

use ForJoyILive\Sidekick\Plugin;

if (class_exists('ForJoyILive\Sidekick\Plugin')) {
    $the_plugin = new Plugin();
}
