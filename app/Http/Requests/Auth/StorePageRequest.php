<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug'],
            'is_published' => ['boolean'],
            
            // Validatie voor de dynamische blokken
            'blocks' => ['nullable', 'array'],
            'blocks.*.type' => ['required', 'string', 'in:text,gallery'],
            'blocks.*.sort_order' => ['required', 'integer'],
            'blocks.*.content' => ['nullable', 'string'], // Voor tekst-blokken
            'blocks.*.title' => ['nullable', 'string', 'max:255'], // Voor galerij-blokken
            
            // Validatie voor galerij-afbeeldingen
            'blocks.*.images' => ['nullable', 'array'],
            'blocks.*.images.*.file' => ['nullable', 'file', 'image', 'max:5120'], // Max 5MB per foto
            'blocks.*.images.*.sort_order' => ['nullable', 'integer'],
        ];
    }
}