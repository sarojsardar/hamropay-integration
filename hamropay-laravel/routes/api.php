<?php

use App\Http\Controllers\HamroPayController;
use Illuminate\Support\Facades\Route;

Route::prefix('hamropay')->group(function () {
    Route::post('/initiate',    [HamroPayController::class, 'initiate']);
    Route::post('/transaction', [HamroPayController::class, 'transaction']);
    Route::post('/webhook',     [HamroPayController::class, 'webhook']);
});
