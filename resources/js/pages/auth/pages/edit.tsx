import PageForm from '@/components/auth/pages/page-form';
import { Head } from '@inertiajs/react';

interface Block {
    id?: number;
    type?: string;
    blockable_type?: string;
    sort_order: number;
    content?: string;
    title?: string;
    blockable?: {
        content?: string;
        title?: string;
        images?: any[];
    };
    images?: any[];
}

interface Page {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    blocks: Block[];
}

interface EditProps {
    page: Page;
}

export default function Edit({ page }: EditProps) {
    // Transformeer de binnenkomende blokken en map de database afbeeldingen naar een preview/url formaat
    const normalizedPage = {
        ...page,
        blocks: (page.blocks || []).map((block) => {
            const rawImages = block.images || block.blockable?.images || [];
            
            // Map de afbeeldingen zodat de frontend direct een URL of preview heeft
            const formattedImages = rawImages.map((img: any) => ({
                ...img,
                // Zorg dat de URL beschikbaar is voor de miniatuur (pas aan indien je asset helper gebruikt)
                url: img.url || (img.image_path ? `/storage/${img.image_path}` : null),
                preview: img.preview || (img.image_path ? `/storage/${img.image_path}` : null),
            }));

            return {
                ...block,
                type: block.blockable_type?.includes('TextBlock') ? 'text' : block.blockable_type?.includes('GalleryBlock') ? 'gallery' : 'text',
                content: block.content || block.blockable?.content || '',
                title: block.title || block.blockable?.title || '',
                images: formattedImages,
            };
        }),
    };

    return (
        <>
            <Head title={`Pagina Bewerken: ${page.title}`} />

            <div className="py-6 w-full">
                <div className="px-4 sm:px-6 lg:px-8 w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pagina Bewerken</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Pas de inhoud en modulaire blokken aan voor "{page.title}".
                        </p>
                    </div>

                    <div className="w-full">
                        <PageForm page={normalizedPage} isEditing={true} />
                    </div>
                </div>
            </div>
        </>
    );
}