<?php

/**
 * Register user meta fields
 */

namespace SidekickWP;

class Meta
{

	public function __construct()
	{
		$this->register_user_fields();
	}

	public function register_user_fields()
	{

		// sidekickwp_history.items is an array of objects with 'prompt', 'result', and 'length' properties
		register_meta('user', 'sidekickwp_history', array(
			"type" => "object",
			"single" => true,
			"show_in_rest" => array(
				'prepare_callback' => function ($value) {
					if (is_user_logged_in()) {
						return $value;
					}
					return '';
				},
				'schema' => array(
					'type'  => 'object',
					'properties' => array(
						'items' => array(
							'type' => 'array',
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'prompt' => array(
										'type' => 'string',
									),
									'result'  => array(
										'type' => 'string',
									),
									'length' => array(
										'type' => 'number',
									),
								),
							),
						),
					),
				)
			),
		));
	}
}
