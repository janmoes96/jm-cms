<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Auth\Blocks\GalleryImage;

class PageBlock extends Model
{
    protected $fillable = [
        'page_id',
        'blockable_type',
        'blockable_id',
        'sort_order',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function blockable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relatie naar de galerij-afbeeldingen van dit blok.
     */
    public function images(): HasMany
    {
        // Pas 'GalleryImage' aan als jouw model voor afbeeldingen anders heet
        return $this->hasMany(GalleryImage::class, 'page_block_id')->orderBy('sort_order');
    }
}