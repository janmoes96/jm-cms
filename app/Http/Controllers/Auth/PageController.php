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
        // dd($request->all(), $page->id);
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