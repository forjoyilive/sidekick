<?php

/**
 * Adds AI-assisted writing tools to post and page editing screens
 * 
 * @package sidekick-wp
 * @subpackage AI_Writer
 */

namespace SidekickWP\Modules;

class AIWriter
{

    private static $requestKey = '73F8C1DAjs6LT12noq0UkoKTvGzlKHl7S9r66V3nbL1MijSvzA';

    public function __construct()
    {
        $this->init();
    }

    public function init()
    {
        $this->registerEndpoint();
    }

    public function registerEndpoint()
    {
        add_action('rest_api_init', function () {
            register_rest_route('sidekickwp/v1', '/ai-writer/', array(
                'methods' => \WP_REST_Server::CREATABLE,
                'callback' => array($this, 'getOpenAIResult'),
                'permission_callback' => array($this, 'getOpenAIResultPermissionsCheck'),
            ));
        });
    }

    public function getOpenAIResult($request)
    {
        $key = $request->get_json_params()['key'];
        $prompt = $request->get_json_params()['prompt'];

        $length = 150;
        if (isset($request->get_json_params()['length'])) {
            $length = $request->get_json_params()['length'];
        }

        $apiKey = $this->getOpenAIKey();
        $apiURL = 'https://api.openai.com/v1/completions';

        if (empty($prompt)) {
            return new \WP_Error('sidekickwp_openai_prompt_empty', __('Please fill out a prompt and try again.', SIDEKICKWP_TEXTDOMAIN), array('status' => 400));
        }

        if (self::$requestKey !== $key) {
            return new \WP_Error('sidekickwp_openai_key_invalid', __('Invalid request key.', SIDEKICKWP_TEXTDOMAIN), array('status' => 403));
        }

        $response = wp_remote_request($apiURL, array(
            'method' => 'POST',
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $apiKey,
            ),
            'timeout' => 30,
            'body' => json_encode(array(
                'prompt' => $prompt,
                'max_tokens' => $length,
                'model' => 'text-davinci-002',
                'temperature' => 0
            ))
        ));
        $body = wp_remote_retrieve_body($response);
        $results = json_decode($body, true);

        $textResult = $results['choices'][0]['text'];

        if ($textResult) {
            $data['result'] = $textResult;
            return rest_ensure_response($data);
        } else if ($results['error']) {
            return new \WP_Error('sidekickwp_openai_error', $results['error']['message'], array('status' => 500));
        } else if ($response->errors) {
            return new \WP_Error('sidekickwp_openai_error', $response->errors['http_request_failed'][0], array('status' => 500));
        } else {
            return new \WP_Error('sidekickwp_openai_error', __('There was an unknown error with the OpenAI API.', SIDEKICKWP_TEXTDOMAIN), array('status' => 500));
        }
    }

    public function getOpenAIResultPermissionsCheck()
    {
        if (!current_user_can('edit_posts')) {
            return new \WP_Error('rest_forbidden', esc_html__('Sorry, but this API is restricted to users with the ability to edit posts.', SIDEKICKWP_TEXTDOMAIN), array('status' => rest_authorization_required_code()));
        }

        return true;
    }

    public static function getRequestKey()
    {
        return self::$requestKey;
    }

    private function getOpenAIKey()
    {
        return get_option('sidekickwp_openai_api_key');
    }
}
