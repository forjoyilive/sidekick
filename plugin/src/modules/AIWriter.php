<?php

/**
 * Adds AI-assisted writing tools to post and page editing screens
 * 
 * @package Sidekick
 * @subpackage AI_Writer
 */

namespace ForJoyILive\Sidekick\Modules;

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
            register_rest_route('fj-sidekick/v1', '/openai/', array(
                'methods' => 'POST',
                'callback' => array($this, 'getOpenAIResult'),
                'permission_callback' => '__return_true',
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

        if (empty($prompt)) {
            return new \WP_Error('fj_sidekick_openai_prompt_empty', __('Prompt is missing', FJ_SIDEKICK_TEXTDOMAIN), array('status' => 400));
        }

        if (self::$requestKey !== $key) {
            return new \WP_Error('fj_sidekick_openai_key_invalid', __('Invalid key', FJ_SIDEKICK_TEXTDOMAIN), array('status' => 403));
        }

        $response = wp_remote_request('https://api.openai.com/v1/completions', array(
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

        $data['result'] = $textResult;

        return new \WP_REST_Response($data, 200);
    }

    public static function getRequestKey()
    {
        return self::$requestKey;
    }

    private function getOpenAIKey()
    {
        return get_option('fj_sidekick_openai_api_key');
    }
}
