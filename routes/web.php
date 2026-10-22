<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Auth\PageController as AdminPageController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('pages', AdminPageController::class);
    });
});

Route::get('/{slug}', [PageController::class, 'show'])->name('pages.show');

require __DIR__.'/settings.php';
