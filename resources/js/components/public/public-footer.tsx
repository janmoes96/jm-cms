export default function PublicFooter() {
    return (
        <footer className="border-t border-green-900 bg-zinc-950 py-6 text-center text-xs text-green-700">
            <div className="max-w-5xl mx-auto px-4">
                [SYSTEM_READY] &copy; {new Date().getFullYear()} - All rights reserved.
            </div>
        </footer>
    );
}