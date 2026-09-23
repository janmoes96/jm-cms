import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface PageItem {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    updated_at: string;
}

interface IndexProps {
    pages: PageItem[];
}

export default function Index({ pages }: IndexProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Weet je zeker dat je deze pagina wilt verwijderen?')) {
            destroy(route('admin.pages.destroy', id));
        }
    };

    return (
        <>
            <Head title="Pagina Beheer" />

            <div className="py-6 w-full">
                <div className="px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pagina's Beheren</h1>
                        <Link
                            href={route('admin.pages.create')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium transition"
                        >
                            + Nieuwe Pagina
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 shadow border border-gray-200 dark:border-zinc-800 overflow-hidden sm:rounded-lg w-full">
                        <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {pages.length > 0 ? (
                                pages.map((page) => (
                                    <li key={page.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition">
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{page.title}</p>
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        page.is_published
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}
                                                >
                                                    {page.is_published ? 'Gepubliceerd' : 'Concept'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Slug: /{page.slug}</p>
                                        </div>

                                        <div className="flex space-x-3 text-sm">
                                            <Link
                                                href={route('admin.pages.edit', page.id)}
                                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
                                            >
                                                Bewerken
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(page.id)}
                                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium"
                                            >
                                                Verwijderen
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                    Nog geen pagina's gevonden. Klik op "Nieuwe Pagina" om er een aan te maken.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}