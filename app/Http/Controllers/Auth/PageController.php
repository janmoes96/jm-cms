<?php

namespace App\Http\Controllers\Auth;

use App\Http\Requests\Auth\StorePageRequest;
use App\Http\Requests\Auth\UpdatePageRequest;
use App\Http\Controllers\Controller;
use App\Models\Auth\Page;
use App\Services\PageService;
use Inertia\Inertia;

use Illuminate\Http\Request;

class PageController extends Controller
{
    // Injecteer de service via dependency injection
    public function __construct(protected PageService $pageService) {}

    public function index()
    {
        return Inertia::render('auth/pages/index', [
            'pages' => Page::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('auth/pages/create');
    }

    public function store(StorePageRequest $request)
    {
        $this->pageService->create($request->validated());

        return redirect()->route('admin.pages.index')
            ->with('success', 'Pagina met blokken succesvol aangemaakt!');
    }

    public function edit(Page $page)
    {
        $page->load(['blocks.blockable' => function ($morphTo) {
            $morphTo->morphWith([
                \App\Models\Auth\Blocks\GalleryBlock::class => ['images'],
            ]);
        }]);

        return Inertia::render('auth/pages/edit', [
            'page' => $page,
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page)
    {
        
        if ($request->has('blocks')) {
            foreach ($request->input('blocks', []) as $blockIndex => $block) {
                if (!empty($block['images'])) {
                    foreach ($block['images'] as $imageIndex => $imageData) {
                        if (isset($imageData['file']) && $imageData['file'] instanceof \Illuminate\Http\UploadedFile) {
                            $file = $imageData['file'];
                            
                            \Illuminate\Support\Facades\Log::error("Upload fout bij blok {$blockIndex}, afbeelding {$imageIndex}:", [
                                'error_code' => $file->getError(),
                                'error_message' => $file->getErrorMessage(),
                                'original_name' => $file->getClientOriginalName(),
                            ]);
                        }
                    }
                }
            }
        }

        $this->pageService->update($page, $request->validated());

        return redirect()->route('admin.pages.index')
            ->with('success', 'Pagina en blokken succesvol bijgewerkt!');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return redirect()->route('admin.pages.index')
            ->with('success', 'Pagina verwijderd!');
    }
}