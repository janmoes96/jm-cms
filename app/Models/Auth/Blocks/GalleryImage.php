<?php

namespace App\Models\Auth\Blocks;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{
    protected $fillable = [
        'gallery_block_id',
        'image_path',
        'caption',
        'sort_order',
    ];

    public function galleryBlock(): BelongsTo
    {
        return $this->belongsTo(GalleryBlock::class);
    }
}