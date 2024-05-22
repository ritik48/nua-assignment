import { GoDownload } from "react-icons/go";
import { useGetBooksQuery, useLazyGetAuthorQuery } from "../redux/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useDebounce } from "../hooks/useDebounce";

function Dashboard() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [search, setSearch] = useState("lord of the rings");
    const debouncedSearch = useDebounce(search);

    const [searchBy, setSearchBy] = useState("title");

    const offset = (page - 1) * limit;

    const [totalPage, setTotalPage] = useState(0);

    const {
        data: books,
        error: bookError,
        isFetching: bookFetching,
    } = useGetBooksQuery(
        { limit, offset, searchBy, search: debouncedSearch },
        { skip: !debouncedSearch }
    );

    const [
        triggerAuthor,
        { data: author, isLoading: authorLoading, errror: authorError },
    ] = useLazyGetAuthorQuery();

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
                            value={search}
                            onChange={(e) => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            className="text-lg  outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 border px-4 py-2 rounded-md"
                            placeholder="Search book"
                        />
                        <select
                            defaultValue={"title"}
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            id="countries"
                            className="font-medium bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-1 focus:ring-blue-400 transition-all duration-300 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value="title">Book title</option>
                            <option value="author">Author</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="self-stretch px-3 py-2 flex justify-center cursor-pointer transition-all duration-300 items-center hover:bg-black hover:text-white rounded-md">
                            <GoDownload size={20} />
                        </div>
                        <select
                            defaultValue={"10"}
                            id="countries"
                            onChange={(e) => {
                                setPage(1);
                                setLimit(parseInt(e.target.value));
                            }}
                            value={limit}
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
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Title
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Publish year
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Subject
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author DOB
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author Top Work
                        </div>
                        <div className="px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
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
                                className="grid text-black grid-cols-[0.4fr_0.2fr_0.2fr_0.3fr_0.2fr_0.3fr_0.2fr]"
                            >
                                <div className="px-3  py-3 text-sm border-[#aaaaaa]">
                                    {book.title}
                                </div>
                                <div className="px-3  py-3 text-sm border-[#aaaaaa]">
                                    {book?.author_name?.[0] || "NA"}
                                </div>
                                <div className="px-3 py-3 text-sm  border-[#aaaaaa]">
                                    {book.first_publish_year || "NA"}
                                </div>
                                <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                    {book.subject?.[0] || "NA"}
                                </div>
                                <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                    {(book.author_name?.[0] &&
                                        authorData.current?.[
                                            book.author_name[0]
                                        ]?.dob) ||
                                        "NA"}
                                </div>
                                <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                    {(book.author_name?.[0] &&
                                        authorData.current?.[
                                            book.author_name[0]
                                        ]?.topWork) ||
                                        "NA"}
                                </div>
                                <div className="px-3 py-3  text-sm border-[#aaaaaa]">
                                    {book.ratings_average || "NA"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {!bookFetching && !authorLoading && author && (
                    <div className="shadow-md  border-[#aaaaaa] rounded-md px-4 py-3 flex items-center justify-between">
                        <div>
                            Showing:{" "}
                            <span className="font-semibold">{offset + 1}</span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {limit * page}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {books.numFound}
                            </span>{" "}
                            results
                        </div>
                        <div className="ml-auto mr-4">
                            Page: <span className="font-semibold">{page}</span>{" "}
                            of{" "}
                            <span className="font-semibold">{totalPage}</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    if (page === 1) return;
                                    setPage(page - 1);
                                }}
                                disabled={
                                    bookFetching ||
                                    !author ||
                                    authorLoading ||
                                    page === 1
                                }
                                className="border-[#a6a5a5] flex justify-center items-center gap-2 text-stone-100 bg-stone-900 rounded-tr-none rounded-br-none duration-300 transition-all hover:bg-stone-700 hover:text-white border px-3 py-2 rounded-md"
                            >
                                <IoMdArrowBack size={20} /> Previous
                            </button>
                            <button
                                disabled={
                                    bookFetching ||
                                    !author ||
                                    authorLoading ||
                                    page === totalPage
                                }
                                onClick={() => {
                                    if (page === totalPage) return;
                                    setPage(page + 1);
                                }}
                                className="border-[#a6a5a5] gap-2 flex justify-center items-center text-stone-100 bg-stone-900 border-l-0 rounded-tl-none rounded-bl-none duration-300 transition-all hover:bg-stone-700 hover:text-white border px-3 py-2 rounded-md"
                            >
                                Next
                                <IoMdArrowForward size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export { Dashboard };
