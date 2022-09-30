<?php

/**
 * Adds AI-assisted writing tools to post and page editing screens
 * 
 * @package Sidekick
 * @subpackage AI_Writer
 */

namespace ForJoyILive\Sidekick;

class Settings
{

    public function __construct()
    {
        $this->init();
    }

    public function init()
    {
        add_action('admin_init', array($this, 'settings_init'));
        add_action('admin_menu', array($this, 'add_options_page'));
    }

    public function settings_init()
    {
        // Register a new setting for "wporg" page.
        register_setting('fj_sidekick_options', 'fj_sidekick_openai_api_key');

        // Register a new section in the "wporg" page.
        add_settings_section(
            'fj_sidekick_openai',
            __('OpenAI Settings', FJ_SIDEKICK_TEXTDOMAIN),
            array($this, 'openai_section'),
            'fj_sidekick'
        );

        // Register a new field in the "wporg_section_developers" section, inside the "wporg" page.
        add_settings_field(
            'fj_sidekick_openai_api_key', // As of WP 4.6 this value is used only internally.
            // Use $args' label_for to populate the id inside the callback.
            __('OpenAI API Key', 'wporg'),
            array($this, 'openai_api_key_callback'),
            'fj_sidekick',
            'fj_sidekick_openai',
            array(
                'label_for'         => 'fj_sidekick_openai_api_key',
                'class'             => 'fj-sidekick-row',
            )
        );
    }

    /**
     * Register our wporg_settings_init to the admin_init action hook.
     */


    /**
     * Custom option and settings:
     *  - callback functions
     */


    /**
     * Developers section callback function.
     *
     * @param array $args  The settings array, defining title, id, callback.
     */
    function openai_section($args)
    {
    }

    /**
     * Pill field callbakc function.
     *
     * WordPress has magic interaction with the following keys: label_for, class.
     * - the "label_for" key value is used for the "for" attribute of the <label>.
     * - the "class" key value is used for the "class" attribute of the <tr> containing the field.
     * Note: you can add custom key value pairs to be used inside your callbacks.
     *
     * @param array $args
     */
    function openai_api_key_callback($args)
    {
        // Get the value of the setting we've registered with register_setting()
        $openai_api_key = get_option('fj_sidekick_openai_api_key');
?>

        <input type="text" id="<?php echo esc_attr($args['label_for']); ?>" name="fj_sidekick_openai_api_key" value="<?php echo esc_attr($openai_api_key); ?>" size="50" />

        <p class="description">
            <?php _e('To get an API key, visit <a href="https://beta.openai.com/account/api-keys">OpenAI API Keys</a>.', FJ_SIDEKICK_TEXTDOMAIN); ?>
        </p>
    <?php
    }

    /**
     * Add the top level menu page.
     */
    function add_options_page()
    {
        add_options_page(
            'Sidekick Options',
            'Sidekick',
            'manage_options',
            'fj_sidekick',
            array($this, 'options_page_html')
        );
    }

    /**
     * Top level menu callback function
     */
    function options_page_html()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (isset($_GET['settings-updated'])) {
            add_settings_error('fj_sidekick_messages', 'fj_sidekick_message', __('Settings Saved', FJ_SIDEKICK_TEXTDOMAIN), 'updated');
        }

    ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('fj_sidekick_options');

                do_settings_sections('fj_sidekick');

                submit_button('Save Settings');
                ?>
            </form>
        </div>
<?php
    }
}
