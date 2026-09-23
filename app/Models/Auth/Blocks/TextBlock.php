<?php

namespace App\Models\Auth\Blocks;

use App\Models\Auth\PageBlock;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class TextBlock extends Model
{
    protected $fillable = [
        'content',
    ];

    public function pageBlocks(): MorphMany
    {
        return $this->morphMany(PageBlock::class, 'blockable');
    }
}
