<?php

/**
 * Adds settings for OpenAI API key
 * 
 * @package sidekick-wp
 * @subpackage AI_Writer
 */

namespace SidekickWP;

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
        register_setting('sidekickwp_options', 'sidekickwp_openai_api_key');

        add_settings_section(
            'sidekickwp_openai',
            __('OpenAI Settings', SIDEKICKWP_TEXTDOMAIN),
            array($this, 'openai_section'),
            'sidekickwp'
        );

        add_settings_field(
            'sidekickwp_openai_api_key',
            __('API Key', SIDEKICKWP_TEXTDOMAIN),
            array($this, 'openai_api_key_callback'),
            'sidekickwp',
            'sidekickwp_openai',
            array(
                'label_for'         => 'sidekickwp_openai_api_key',
                'class'             => 'sidekickwp-row',
            )
        );
    }


    /**
     * Developers section callback function.
     *
     * @param array $args  The settings array, defining title, id, callback.
     */
    function openai_section($args)
    {
    }

    /**
     * Display the API key input field
     * 
     * @param array $args
     */
    function openai_api_key_callback($args)
    {
        $openai_api_key = get_option('sidekickwp_openai_api_key');
?>

        <input type="text" id="<?php echo esc_attr($args['label_for']); ?>" name="sidekickwp_openai_api_key" value="<?php echo esc_attr($openai_api_key); ?>" size="50" />

        <p class="description">
            <?php _e('To get an API key, visit <a href="https://beta.openai.com/account/api-keys">OpenAI API Keys</a>.', SIDEKICKWP_TEXTDOMAIN); ?>
        </p>
    <?php
    }

    /**
     * Add the options page.
     */
    function add_options_page()
    {
        add_options_page(
            __('Sidekick WP Options', SIDEKICKWP_TEXTDOMAIN),
            __('Sidekick WP', SIDEKICKWP_TEXTDOMAIN),
            'manage_options',
            'sidekickwp',
            array($this, 'options_page_html')
        );
    }

    /**
     * Display the options page
     */
    function options_page_html()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (isset($_GET['settings-updated'])) {
            add_settings_error('sidekickwp_messages', 'sidekickwp_message', __('Settings Saved', SIDEKICKWP_TEXTDOMAIN), 'updated');
        }

    ?>
        <div class="wrap sidekickwp-options">
            <img alt="<?php _e('Sidekick logo', SIDEKICKWP_TEXTDOMAIN); ?>" src="<?php echo SIDEKICKWP_BUILD_URL . '/images/s-logo.svg'; ?>" class="sidekickwp-logo" />
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('sidekickwp_options');

                do_settings_sections('sidekickwp');

                submit_button('Save Settings');
                ?>
            </form>
        </div>
<?php
    }
}
