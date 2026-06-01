<?php

return [
    'api_base_url'   => env('HAMROPAY_API_BASE_URL'),
    'gateway_url'    => env('HAMROPAY_GATEWAY_URL'),
    'client_id'      => env('HAMROPAY_CLIENT_ID'),
    'client_api_key' => env('HAMROPAY_CLIENT_API_KEY'),
    'secret'         => env('HAMROPAY_SECRET'),
    'merchant_id'    => env('HAMROPAY_MERCHANT_ID'),
    'webhook_secret' => env('HAMROPAY_WEBHOOK_SECRET'),
    'success_url'    => env('HAMROPAY_SUCCESS_URL'),
    'failure_url'    => env('HAMROPAY_FAILURE_URL'),
];
