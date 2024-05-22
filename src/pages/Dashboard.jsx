import { GoDownload } from "react-icons/go";
import { useGetBooksQuery, useLazyGetAuthorQuery } from "../redux/api";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useDebounce } from "../hooks/useDebounce";
import { BookTable } from "../components/BookTable";
import { bookWithAuthor, sortedBooks } from "../utils";

function Dashboard() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("lord of the rings");
    const debouncedSearch = useDebounce(search);
    const [sortBy, setSortBy] = useState({});
    const [searchBy, setSearchBy] = useState("title");
    const offset = (page - 1) * limit;
    const [totalPage, setTotalPage] = useState(0);
    const [sortedFilteredData, setSortedFilteredData] = useState([]);
    let authorData = useRef({});
    const [bookData, setBookData] = useState([]);

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

    function handleChangeSort(value) {
        setSortBy((prev) => ({
            ...prev,
            [value]: prev[value] === "asc" ? "desc" : "asc",
        }));
    }

    useEffect(() => {
        if (bookFetching) return;

        setTotalPage(Math.ceil(books.numFound / limit));

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

    useEffect(() => {
        if (authorLoading || bookFetching) return;

        const tempBookData = bookWithAuthor(authorData, books);

        setBookData(tempBookData);
    }, [authorLoading, bookFetching, books, sortBy]);

    useEffect(() => {
        if (authorLoading || bookFetching) return;

        const sortedData = sortedBooks(bookData, sortBy);

        setSortedFilteredData(sortedData);
    }, [sortBy, bookData, authorLoading, bookFetching]);

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
                            onChange={(e) => {
                                if (search.length === 0) return;
                                setPage(1);
                                setSearchBy(e.target.value);
                            }}
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
                                if (search.length === 0) return;
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
                <BookTable
                    author={author}
                    bookError={bookError}
                    authorLoading={authorLoading}
                    sortedFilteredData={sortedFilteredData}
                    sortBy={sortBy}
                    bookFetching={bookFetching}
                    search={search}
                    handleChangeSort={handleChangeSort}
                />

                <div className="shadow-md  border-[#aaaaaa] rounded-md px-4 py-3 flex items-center justify-between">
                    {books.numFound === 0 && search.length > 0 && (
                        <div>No results found</div>
                    )}
                    {books.numFound > 0 && search.length > 0 && (
                        <div>
                            Showing:{" "}
                            <span className="font-semibold">
                                {Math.min(offset + 1, books.numFound)}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold">
                                {Math.min(limit * page, books.numFound)}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">
                                {books.numFound}
                            </span>{" "}
                            results
                        </div>
                    )}
                    {books.numFound > 0 && search.length > 0 && (
                        <div className="ml-auto mr-4">
                            Page: <span className="font-semibold">{page}</span>{" "}
                            of{" "}
                            <span className="font-semibold">{totalPage}</span>
                        </div>
                    )}
                    {books.numFound > 0 && search.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}

export { Dashboard };
