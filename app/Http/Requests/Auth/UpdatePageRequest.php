<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pageId = $this->route('page')->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug,' . $pageId],
            'is_published' => ['boolean'],
            
            // Flexibele validatie voor de dynamische blokken
            'blocks' => ['nullable', 'array'],
            'blocks.*.id' => ['nullable', 'integer', 'exists:page_blocks,id'],
            'blocks.*.sort_order' => ['nullable', 'integer'],
            
            // Accepteer zowel type als blockable_type
            'blocks.*.type' => ['nullable', 'string'],
            'blocks.*.blockable_type' => ['nullable', 'string'],
            
            // Inhoud velden
            'blocks.*.content' => ['nullable', 'string'],
            'blocks.*.title' => ['nullable', 'string', 'max:255'],
            
            // Geneste blockable data opvangen
            'blocks.*.blockable' => ['nullable', 'array'],
            'blocks.*.blockable.content' => ['nullable', 'string'],
            'blocks.*.blockable.title' => ['nullable', 'string', 'max:255'],
            
            // Galerij-afbeeldingen
            'blocks.*.images' => ['nullable', 'array'],
            'blocks.*.images.*.id' => ['nullable', 'integer', 'exists:gallery_images,id'],
            'blocks.*.images.*.file' => ['nullable', 'file', 'image', 'max:5120'],
            'blocks.*.images.*.sort_order' => ['nullable', 'integer'],

            // DEZE TOEVOEGEN: Te verwijderen afbeelding ID's doorlaten door de validatie
            'blocks.*.deleted_image_ids' => ['nullable', 'array'],
            'blocks.*.deleted_image_ids.*' => ['integer', 'exists:gallery_images,id'],
        ];
    }
}