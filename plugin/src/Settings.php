<?php

/**
 * Adds settings for OpenAI API key
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
        register_setting('fj_sidekick_options', 'fj_sidekick_openai_api_key');

        add_settings_section(
            'fj_sidekick_openai',
            __('OpenAI Settings', FJ_SIDEKICK_TEXTDOMAIN),
            array($this, 'openai_section'),
            'fj_sidekick'
        );

        add_settings_field(
            'fj_sidekick_openai_api_key',
            __('API Key', FJ_SIDEKICK_TEXTDOMAIN),
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
        $openai_api_key = get_option('fj_sidekick_openai_api_key');
?>

        <input type="text" id="<?php echo esc_attr($args['label_for']); ?>" name="fj_sidekick_openai_api_key" value="<?php echo esc_attr($openai_api_key); ?>" size="50" />

        <p class="description">
            <?php _e('To get an API key, visit <a href="https://beta.openai.com/account/api-keys">OpenAI API Keys</a>.', FJ_SIDEKICK_TEXTDOMAIN); ?>
        </p>
    <?php
    }

    /**
     * Add the options page.
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
     * Display the options page
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
        <div class="wrap fj-sidekick-options">
            <img alt="<?php _e('Sidekick logo', FJ_SIDEKICK_TEXTDOMAIN); ?>" src="<?php echo FJ_SIDEKICK_BUILD_URL . '/images/s-logo.svg'; ?>" class="fj-sidekick-logo" />
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
