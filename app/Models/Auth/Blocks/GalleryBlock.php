<?php

namespace App\Models\Auth\Blocks;

use App\Models\Auth\PageBlock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class GalleryBlock extends Model
{
    protected $fillable = [
        'title',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(GalleryImage::class)->orderBy('sort_order');
    }

    public function pageBlocks(): MorphMany
    {
        return $this->morphMany(PageBlock::class, 'blockable');
    }
}
