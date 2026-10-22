<?php

namespace App\Services;

use App\Models\Auth\Page;
use App\Models\Auth\Blocks\TextBlock;
use App\Models\Auth\Blocks\GalleryBlock;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PageService
{
    public function create(array $data): Page
    {
        Log::info('CREATE - Data ontvangen:', $data);

        return DB::transaction(function () use ($data) {
            $page = Page::create([
                'title' => $data['title'],
                'slug' => $data['slug'],
                'is_published' => $data['is_published'] ?? false,
            ]);

            if (!empty($data['blocks'])) {
                $this->syncBlocks($page, $data['blocks']);
            }

            return $page;
        });
    }

    public function update(Page $page, array $data): Page
    {
        Log::info('UPDATE - Data ontvangen voor pagina ID: ' . $page->id, $data);

        return DB::transaction(function () use ($page, $data) {
            $page->update([
                'title' => $data['title'],
                'slug' => $data['slug'],
                'is_published' => $data['is_published'] ?? false,
            ]);

            $this->syncBlocks($page, $data['blocks'] ?? []);

            return $page;
        });
    }

    private function syncBlocks(Page $page, array $blocksData): void
    {
        $incomingBlockIds = collect($blocksData)->pluck('id')->filter()->toArray();
        Log::info('SYNC - Inkomende blok IDs:', $incomingBlockIds);

        // Verwijder oude blokken die niet meer meegestuurd zijn
        $page->blocks()->whereNotIn('id', $incomingBlockIds)->get()->each(function ($oldBlock) {
            Log::info('SYNC - Oud blok verwijderen ID: ' . $oldBlock->id);
            if ($oldBlock->blockable instanceof GalleryBlock) {
                foreach ($oldBlock->blockable->images as $image) {
                    if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                        Storage::disk('public')->delete($image->image_path);
                    }
                }
                $oldBlock->blockable->images()->delete();
            }
            
            $oldBlock->blockable?->delete();
            $oldBlock->delete();
        });

        foreach ($blocksData as $index => $blockData) {
            $sortOrder = $blockData['sort_order'] ?? $index;

            // Probeer bestaand blok te updaten als er een geldig ID is
            if (!empty($blockData['id'])) {
                $pageBlock = $page->blocks()->find($blockData['id']);
                if ($pageBlock && $pageBlock->blockable) {
                    Log::info('SYNC - Bestaand blok bijwerken ID: ' . $blockData['id']);
                    $this->updateBlockContent($pageBlock->blockable, $blockData);
                    $pageBlock->update(['sort_order' => $sortOrder]);
                    continue;
                }
            }

            // Anders is het een nieuw blok
            Log::info('SYNC - Nieuw blok aanmaken op index: ' . $index, $blockData);
            $this->createNewBlock($page, $blockData, $sortOrder);
        }
    }

    private function updateBlockContent($blockModel, array $blockData): void
    {
        $type = $blockData['type'] ?? $blockData['blockable_type'] ?? '';
        $content = $blockData['content'] ?? $blockData['blockable']['content'] ?? '';
        $title = $blockData['title'] ?? $blockData['blockable']['title'] ?? null;

        Log::info('UPDATE BLOCK - Type: ' . $type, ['content' => $content, 'title' => $title]);

        match (true) {
            str_contains($type, 'text') || str_contains($type, 'TextBlock') => $blockModel->update([
                'content' => $content
            ]),
            
            str_contains($type, 'gallery') || str_contains($type, 'GalleryBlock') => (function () use ($blockModel, $blockData, $title) {
                $blockModel->update([
                    'title' => $title
                ]);

                // Verwijder aangegeven afbeeldingen
                if (!empty($blockData['deleted_image_ids'])) {
                    $imagesToDelete = $blockModel->images()->whereIn('id', $blockData['deleted_image_ids'])->get();
                    foreach ($imagesToDelete as $image) {
                        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                            Storage::disk('public')->delete($image->image_path);
                        }
                        $image->delete();
                    }
                }

                $this->syncGalleryImages($blockModel, $blockData);
            })(),

            default => Log::warning('UPDATE BLOCK - Onbekend blok type gekregen: ' . $type),
        };
    }

    private function createNewBlock(Page $page, array $blockData, int $sortOrder): void
    {
        $type = $blockData['type'] ?? $blockData['blockable_type'] ?? '';
        $content = $blockData['content'] ?? $blockData['blockable']['content'] ?? '';
        $title = $blockData['title'] ?? $blockData['blockable']['title'] ?? null;

        Log::info('CREATE BLOCK - Type gedetecteerd: ' . $type);

        $blockModel = match (true) {
            str_contains($type, 'text') || str_contains($type, 'TextBlock') => TextBlock::create([
                'content' => $content
            ]),
            
            str_contains($type, 'gallery') || str_contains($type, 'GalleryBlock') => GalleryBlock::create([
                'title' => $title
            ]),

            default => null,
        };

        if ($blockModel) {
            if ($blockModel instanceof GalleryBlock) {
                $this->syncGalleryImages($blockModel, $blockData);
            }

            $page->blocks()->create([
                'blockable_type' => get_class($blockModel),
                'blockable_id' => $blockModel->id,
                'sort_order' => $sortOrder,
            ]);
            Log::info('CREATE BLOCK - Succesvol aangemaakt en gekoppeld aan pagina ID: ' . $page->id);
        } else {
            Log::error('CREATE BLOCK - Kon geen model aanmaken voor type: ' . $type);
        }
    }

    private function syncGalleryImages(GalleryBlock $galleryBlock, array $blockData): void
    {
        $images = $blockData['images'] ?? $blockData['blockable']['images'] ?? [];

        if (empty($images)) {
            return;
        }

        foreach ($images as $imageIndex => $imageData) {
            if (isset($imageData['file']) && $imageData['file'] instanceof \Illuminate\Http\UploadedFile) {
                $path = $imageData['file']->store('galleries', 'public');

                $galleryBlock->images()->create([
                    'image_path' => $path,
                    'sort_order' => $imageData['sort_order'] ?? $imageIndex,
                ]);
                Log::info('GALLERY - Nieuwe afbeelding opgeslagen op pad: ' . $path);
            }
            elseif (isset($imageData['id'])) {
                $galleryBlock->images()->where('id', $imageData['id'])->update([
                    'sort_order' => $imageData['sort_order'] ?? $imageIndex,
                ]);
            }
        }
    }
}