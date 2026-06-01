<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class HamroPayService
{
    private string $apiBaseUrl;
    private string $clientId;
    private string $clientApiKey;
    private string $secret;
    private string $merchantId;

    public function __construct()
    {
        $this->apiBaseUrl   = config('hamropay.api_base_url');
        $this->clientId     = config('hamropay.client_id');
        $this->clientApiKey = config('hamropay.client_api_key');
        $this->secret       = config('hamropay.secret');
        $this->merchantId   = config('hamropay.merchant_id');
    }

    public function sign(string $message): string
    {
        return base64_encode(hash_hmac('sha512', $message, $this->secret, true));
    }

    private function headers(string $signature): array
    {
        return [
            'Client-Id'      => $this->clientId,
            'Client-API-Key' => $this->clientApiKey,
            'Signature'      => $signature,
            'Content-Type'   => 'application/json',
        ];
    }

    public function createSession(array $data): array
    {
        $sig = $this->sign(implode(',', [
            $data['merchantTxnId'],
            $data['transactionAmount'],
            $this->merchantId,
            $this->clientId,
            $this->clientApiKey,
        ]));

        $payload = array_merge($data, ['merchantId' => $this->merchantId]);

        $response = Http::withHeaders($this->headers($sig))
            ->post("{$this->apiBaseUrl}/v1/checkout/sessionId", $payload);

        return $response->json();
    }

    public function buildCheckoutParams(string $sessionId, string $merchantTxnId, int $transactionAmount, string $remarks = ''): array
    {
        $token = $this->sign(implode(',', [
            $this->merchantId,
            $merchantTxnId,
            $sessionId,
            $transactionAmount,
            $this->clientId,
            $this->clientApiKey,
        ]));

        return [
            'merchant_id'            => $this->merchantId,
            'session_id'             => $sessionId,
            'token'                  => $token,
            'merchant_transaction_id'=> $merchantTxnId,
            'remarks'                => $remarks,
        ];
    }

    public function getTransaction(string $merchantTxnId): array
    {
        $sig = $this->sign(implode(',', [
            $merchantTxnId,
            $this->merchantId,
            $this->clientId,
            $this->clientApiKey,
        ]));

        $response = Http::withHeaders($this->headers($sig))
            ->post("{$this->apiBaseUrl}/v1/checkout/transaction", [
                'merchantId'    => $this->merchantId,
                'merchantTxnId' => $merchantTxnId,
            ]);

        return $response->json();
    }

    public function verifyWebhookSignature(string $headerSig, string $merchantTxnId, string $status, float $amount): bool
    {
        $webhookSecret = config('hamropay.webhook_secret');
        $expected = base64_encode(hash_hmac('sha512', implode(',', [
            $merchantTxnId,
            $this->merchantId,
            $status,
            $amount,
        ]), $webhookSecret, true));

        return hash_equals($expected, $headerSig);
    }

    public function getGatewayUrl(): string
    {
        return config('hamropay.gateway_url');
    }
}
