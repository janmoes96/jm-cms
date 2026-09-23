import PageForm from '@/components/auth/pages/page-form';
import { Head } from '@inertiajs/react';

export default function Create() {
    return (
        <>
            <Head title="Nieuwe Pagina Aanmaken" />

            <div className="py-6 w-full">
                <div className="px-4 sm:px-6 lg:px-8 w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Nieuwe Pagina Aanmaken</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Voeg een nieuwe pagina toe en bouw deze op met modulaire blokken.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 shadow border border-gray-200 dark:border-zinc-800 rounded-lg p-6 w-full">
                        <PageForm />
                    </div>
                </div>
            </div>
        </>
    );
}