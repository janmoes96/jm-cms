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

        // Verwijder oude blokken en bijbehorende opslag
        $page->blocks()->whereNotIn('id', $incomingBlockIds)->get()->each(function ($oldBlock) {
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

            if (!empty($blockData['id'])) {
                $pageBlock = $page->blocks()->find($blockData['id']);
                if ($pageBlock && $pageBlock->blockable) {
                    $this->updateBlockContent($pageBlock->blockable, $blockData);
                    $pageBlock->update(['sort_order' => $sortOrder]);
                    continue;
                }
            }

            $this->createNewBlock($page, $blockData, $sortOrder);
        }
    }

    private function updateBlockContent($blockModel, array $blockData): void
    {
        $type = $blockData['type'] ?? '';
        if (empty($type) && isset($blockData['blockable_type'])) {
            $type = str_contains($blockData['blockable_type'], 'TextBlock') ? 'text' : 'gallery';
        }

        $content = $blockData['content'] ?? $blockData['blockable']['content'] ?? '';
        $title = $blockData['title'] ?? $blockData['blockable']['title'] ?? null;

        match ($type) {
            'text', 'App\\Models\\Auth\\Blocks\\TextBlock' => $blockModel->update([
                'content' => $content
            ]),
            
            'gallery', 'App\\Models\\Auth\\Blocks\\GalleryBlock' => (function () use ($blockModel, $blockData, $title) {

                $blockModel->update([
                    'title' => $title
                ]);

                // 1. Verwijder specifieke afbeeldingen via deleted_image_ids
                if (!empty($blockData['deleted_image_ids'])) {
                    $imagesToDelete = $blockModel->images()->whereIn('id', $blockData['deleted_image_ids'])->get();
                    
                    Log::info('Aantal gevonden afbeeldingen om te wissen:', ['count' => $imagesToDelete->count()]);

                    foreach ($imagesToDelete as $image) {
                        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                            Storage::disk('public')->delete($image->image_path);
                        }
                        $image->delete();
                    }
                }

                // 2. Synchroniseer de resterende of nieuwe afbeeldingen
                $this->syncGalleryImages($blockModel, $blockData);
            })(),

            default => null,
        };
    }

    private function createNewBlock(Page $page, array $blockData, int $sortOrder): void
    {
        $type = $blockData['type'] ?? '';
        if (empty($type) && isset($blockData['blockable_type'])) {
            $type = str_contains($blockData['blockable_type'], 'TextBlock') ? 'text' : 'gallery';
        }

        $content = $blockData['content'] ?? $blockData['blockable']['content'] ?? '';
        $title = $blockData['title'] ?? $blockData['blockable']['title'] ?? null;

        $blockModel = match ($type) {
            'text', 'App\\Models\\Auth\\Blocks\\TextBlock' => TextBlock::create([
                'content' => $content
            ]),
            
            'gallery', 'App\\Models\\Auth\\Blocks\\GalleryBlock' => GalleryBlock::create([
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
            }
            elseif (isset($imageData['id'])) {
                $galleryBlock->images()->where('id', $imageData['id'])->update([
                    'sort_order' => $imageData['sort_order'] ?? $imageIndex,
                ]);
            }
        }
    }
}