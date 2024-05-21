import { GoDownload } from "react-icons/go";
import { useGetBooksQuery, useLazyGetAuthorQuery } from "../redux/api";
import { useEffect, useRef, useState } from "react";

function Dashboard() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const offset = (page - 1) * limit;

    const [totalPage, setTotalPage] = useState(0);

    const {
        data: books,
        error: bookError,
        isFetching: bookFetching,
    } = useGetBooksQuery({ limit, offset });

    const [
        triggerAuthor,
        { data: author, isLoading: authorLoading, errror: authorError },
    ] = useLazyGetAuthorQuery();

    // console.log("book loading = ", bookFetching);

    let authorData = useRef({});

    useEffect(() => {
        if (bookFetching) return;

        setTotalPage(Math.ceil(books.numFound / limit));

        // get data of all the authors whose books are fetched
        books.docs.forEach((book) => {
            const authorName = book?.author_name?.[0];

            if (!authorName) return;

            if (Object.keys(authorData).includes(authorName)) {
                return;
            }

            triggerAuthor(book?.author_name?.[0]).then((d) => {
                const authorName = book?.author_name?.[0];

                authorData.current = {
                    ...authorData.current,
                    [authorName]: {
                        dob: d?.data?.docs?.[0]["birth_date"],
                        topWork: d?.data?.docs?.[0]["top_work"],
                    },
                };
            });
        });
    }, [bookFetching, books, triggerAuthor, limit]);

    console.log("Book fetching = ", bookFetching);

    return (
        <div className="mt-5">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-semibold">Search Books</h1>
                <div className="flex justify-between items-center mt-5">
                    <div className="flex items-center gap-2">
                        <input
                            className="text-lg  outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 border px-4 py-2 rounded-md"
                            placeholder="Search book"
                        />
                        <select
                            defaultValue={"title"}
                            id="countries"
                            className="font-medium bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option>Search book by</option>
                            <option value="title">Book title</option>
                            <option value="author">Author</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="border self-stretch px-3 py-2 flex justify-center cursor-pointer transition-all duration-300 items-center hover:bg-black hover:text-white rounded-md">
                            <GoDownload size={20} />
                        </div>
                        <select
                            defaultValue={"10"}
                            id="countries"
                            className="font-medium bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="10">10 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 overflow-y-scroll h-[450px] rounded-md">
                    <div className="grid top-0 sticky bg-[#dedddd] text-black grid-cols-[0.4fr_0.2fr_0.2fr_0.3fr_0.2fr_0.3fr_0.2fr]">
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Title
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Author
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Publish year
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Subject
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Author DOB
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Author Top Work
                        </div>
                        <div className="px-3 py-3 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                            Average rating
                        </div>
                    </div>
                    {bookFetching || !author || authorLoading ? (
                        <div className="text-3xl text-center mt-10">
                            Loading...
                        </div>
                    ) : (
                        books.docs.map((book, index) => (
                            <div
                                key={index}
                                className="grid border-l-0 text-black grid-cols-[0.4fr_0.2fr_0.2fr_0.3fr_0.2fr_0.3fr_0.2fr]"
                            >
                                <div className="px-3 border-b-0 py-3 border text-sm border-[#aaaaaa]">
                                    {book.title}
                                </div>
                                <div className="px-3 border-b-0 border-l-0 py-3 border text-sm border-[#aaaaaa]">
                                    {book?.author_name?.[0] || "NA"}
                                </div>
                                <div className="px-3 border-b-0 border-l-0 py-3 border text-sm  border-[#aaaaaa]">
                                    {book.first_publish_year || "NA"}
                                </div>
                                <div className="px-3 border-b-0 border-l-0 py-3 border text-sm border-[#aaaaaa]">
                                    {book.subject?.[0] || "NA"}
                                </div>
                                <div className="px-3 border-b-0 border-l-0 py-3 border text-sm border-[#aaaaaa]">
                                    {(book.author_name?.[0] &&
                                        authorData.current?.[
                                            book.author_name[0]
                                        ]?.dob) ||
                                        "NA"}
                                </div>
                                <div className="px-3 border-b-0 border-l-0 py-3 border text-sm border-[#aaaaaa]">
                                    {(book.author_name?.[0] &&
                                        authorData.current?.[
                                            book.author_name[0]
                                        ]?.topWork) ||
                                        "NA"}
                                </div>
                                <div className="px-3 py-3 border-l-0 border-b-0 border text-sm font-semibold border-[#aaaaaa]">
                                    {book.ratings_average}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="bg-[#f5f5f5] font-semibold border-t-0 border border-[#aaaaaa] px-4 py-3 flex items-center justify-between">
                    <div>
                        Page: {page} of {totalPage}
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="border border-[#a6a5a5] px-3 py-2 rounded-md">
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="border border-[#a6a5a5] px-3 py-2 rounded-md"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Dashboard };
