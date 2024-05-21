import { GoDownload } from "react-icons/go";

function Dashboard() {
    return (
        <div className="mt-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-semibold">Search Books</h1>
                <div className="flex justify-between items-center mt-5">
                    <div className="flex items-center gap-2">
                        <input
                            className="text-lg  outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 border px-4 py-2 rounded-md"
                            placeholder="Search book"
                        />
                        <select
                            id="countries"
                            className="font-medium bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option selected>Search book by</option>
                            <option value="title">Book title</option>
                            <option value="author">Author</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="border self-stretch px-3 py-2 flex justify-center cursor-pointer transition-all duration-300 items-center hover:bg-black hover:text-white rounded-md">
                            <GoDownload size={20} />
                        </div>
                        <select
                            id="countries"
                            className="font-medium bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option selected>10 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Dashboard };
