<?php

namespace App\Http\Controllers;

use App\Models\Auth\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(string $slug): Response
    {
        $page = Page::where('slug', $slug)
            ->where('is_published', true)
            ->with([
                'blocks' => function ($query) {
                    $query->orderBy('sort_order');
                },
                // Laad de blockable in, en als het een GalleryBlock is, laad dan ook de images in
                'blocks.blockable' => function ($morphTo) {
                    $morphTo->morphWith([
                        \App\Models\Auth\Blocks\GalleryBlock::class => ['images'],
                    ]);
                },
            ])
            ->firstOrFail();

        return Inertia::render('public/pages/show', [
            'page' => $page,
        ]);
    }
}