<?php

/**
 * Register user meta fields
 */

namespace ForJoyILive\Sidekick;

class Meta
{

	public function __construct()
	{
		$this->register_user_fields();
	}

	public function register_user_fields()
	{

		// fj_sidekick_history.items is an array with 'query' and 'result' properties
		register_meta('user', 'fj_sidekick_history', array(
			"type" => "object",
			"single" => true,
			"show_in_rest" => array(
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
