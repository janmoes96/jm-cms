import React from 'react';

interface GalleryImage {
    id?: number;
    file?: File;
    image_path?: string;
    url?: string;
    preview?: string;
    sort_order?: number;
}

interface GalleryBlockProps {
    block: {
        id?: number;
        title?: string;
        images?: GalleryImage[];
        deleted_image_ids?: number[]; // Handig om bij te houden voor de backend
        [key: string]: any;
    };
    onChange: (updatedBlock: any) => void;
}

export default function GalleryBlockComponent({ block, onChange }: GalleryBlockProps) {
    const images = block.images || [];

    // Titel van het galerijblok aanpassen
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...block,
            title: e.target.value,
        });
    };

    // Nieuwe bestanden toevoegen
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        
        // Maak lokale previews aan voor de nieuwe bestanden
        const newImages: GalleryImage[] = filesArray.map((file, index) => ({
            file: file,
            preview: URL.createObjectURL(file),
            sort_order: images.length + index,
        }));

        onChange({
            ...block,
            images: [...images, ...newImages],
        });

        // Reset de file input zodat dezelfde foto eventueel opnieuw geselecteerd kan worden
        e.target.value = '';
    };

    // Afbeelding verwijderen (zowel lokaal als database)
    const handleRemoveImage = (indexToRemove: number) => {
        const imageToRemove = images[indexToRemove];
        const updatedImages = images.filter((_, index) => index !== indexToRemove);

        let deletedIds = block.deleted_image_ids || [];

        // Als de afbeelding al in de database stond (heeft een ID), voeg hem toe aan de verwijderlijst
        if (imageToRemove.id) {
            deletedIds = [...deletedIds, imageToRemove.id];
        }

        // Geef de opgeschoonde lijst en eventuele te verwijderen ID's door aan de parent
        onChange({
            ...block,
            images: updatedImages,
            deleted_image_ids: deletedIds,
        });
    };

    return (
        <div className="space-y-4">
            {/* Blok Titel */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Galerij Titel (Optioneel)
                </label>
                <input
                    type="text"
                    value={block.title || ''}
                    onChange={handleTitleChange}
                    placeholder="Bijv. Project Foto's"
                    className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* Afbeeldingen Grid */}
            <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Afbeeldingen
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                    {images.map((img, index) => {
                        // Bepaal de juiste bron voor de thumbnail (lokale preview of bestaande url/pad)
                        const imgSrc = img.preview || img.url || (img.image_path ? `/storage/${img.image_path}` : '');

                        return (
                            <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 aspect-square flex items-center justify-center">
                                {imgSrc ? (
                                    <img
                                        src={imgSrc}
                                        alt={`Galerij afbeelding ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">Geen voorbeeld</span>
                                )}

                                {/* Verwijder knop per afbeelding */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md opacity-90 transition transform hover:scale-105"
                                    title="Verwijder afbeelding"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Upload knop */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700 dark:file:bg-zinc-800 dark:file:text-indigo-400
                        hover:file:bg-indigo-100 dark:hover:file:bg-zinc-700 cursor-pointer"
                />
            </div>
        </div>
    );
}