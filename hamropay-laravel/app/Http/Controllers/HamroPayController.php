<?php

namespace App\Http\Controllers;

use App\Services\HamroPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HamroPayController
{
    public function __construct(private HamroPayService $hamroPay) {}

    // POST /api/hamropay/initiate
    public function initiate(Request $request)
    {
        $request->validate([
            'amount'   => 'required|integer|min:1000|max:5000000',
            'remarks'  => 'nullable|string|max:250',
            'products' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        $merchantTxnId = Str::random(20);

        $sessionData = $this->hamroPay->createSession([
            'merchantTxnId'         => $merchantTxnId,
            'transactionAmount'     => $request->amount,
            'failedRedirectionUrl'  => config('hamropay.failure_url'),
            'successRedirectionUrl' => config('hamropay.success_url'),
            'productList'           => $request->products ?? [],
            'metadata'              => $request->metadata ?? [],
        ]);

        if (empty($sessionData['sessionId'])) {
            return response()->json(['error' => $sessionData['message'] ?? 'Session creation failed'], 422);
        }

        $params = $this->hamroPay->buildCheckoutParams(
            $sessionData['sessionId'],
            $merchantTxnId,
            $request->amount,
            $request->remarks ?? ''
        );

        return response()->json([
            'gateway_url' => $this->hamroPay->getGatewayUrl() . '/api/checkout',
            'params'      => $params,
        ]);
    }

    // POST /api/hamropay/transaction
    public function transaction(Request $request)
    {
        $request->validate(['merchant_txn_id' => 'required|string']);

        $result = $this->hamroPay->getTransaction($request->merchant_txn_id);

        return response()->json($result);
    }

    // POST /api/hamropay/webhook
    public function webhook(Request $request)
    {
        $sig  = $request->header('Signature');
        $body = $request->all();

        if (!$sig || !$this->hamroPay->verifyWebhookSignature(
            $sig,
            $body['merchantTxnId'],
            $body['status'],
            $body['amount']
        )) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        // TODO: update your order status based on $body['merchantTxnId'] and $body['status']

        return response()->json(['received' => true]);
    }
}
