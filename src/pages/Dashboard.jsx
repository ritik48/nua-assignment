import { GoDownload } from "react-icons/go";
import { useGetBooksQuery, useLazyGetAuthorQuery } from "../redux/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { useDebounce } from "../hooks/useDebounce";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";

function Dashboard() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [search, setSearch] = useState("lord of the rings");
    const debouncedSearch = useDebounce(search);

    const [sortBy, setSortBy] = useState({});

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

    const [bookData, setBookData] = useState([]);

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

    const columns = useMemo(
        () => [
            ["title", "asc"],
            ["author_name", "asc"],
            ["first_publish_year", "asc"],
            ["subject", "asc"],
            ["dob", "asc"],
            ["topWork", "asc"],
            ["rating", "asc"],
        ],
        []
    );
    useEffect(() => {
        if (authorLoading || bookFetching) return;
        // console.log("here = ", authorData);

        const tempBookData = books.docs.map((book) => {
            if (!book.author_name) {
                return {
                    ...book,
                    author_top_work: "NA",
                    author_dob: "NA",
                    author_name: "NA",
                    subject: book.subject ? book.subject[0] : "NA",
                };
            }

            // console.log("author = ", authorData.current) line 2
            const topWork =
                authorData.current?.[book.author_name[0]]?.topWork ?? "NA";
            const dob = authorData.current?.[book.author_name[0]]?.dob ?? "NA";

            return {
                ...book,
                author_topWork: topWork,
                author_dob: dob,
                subject: book.subject ? book.subject[0] : "NA",
                author_name: book.author_name[0],
            };
        });

        setBookData(tempBookData);
    }, [authorLoading, bookFetching, books, sortBy, columns]);

    function handleChangeSort(value) {
        setSortBy((prev) => ({
            ...prev,
            [value]: prev[value] === "asc" ? "desc" : "asc",
        }));
    }

    const [sortedFilteredData, setSortedFilteredData] = useState([]);

    useEffect(() => {
        if (authorLoading || bookFetching) return;

        const sortedData = [...bookData].sort((a, b) => {
            for (const column in sortBy) {
                const direction = sortBy[column];
                const aValue = a[column];
                const bValue = b[column];

                // console.log("column = ", column);

                // Handling "NA" values
                if (aValue === "NA" && bValue !== "NA") {
                    return 1; // "NA" should come after other values
                }
                if (aValue !== "NA" && bValue === "NA") {
                    return -1; // Other value should come before "NA"
                }

                // If values are equal or both "NA", move to next filter
                if (aValue === bValue) continue;

                // Comparing different data types
                if (typeof aValue === "string" && typeof bValue === "string") {
                    // If both values are strings, perform string comparison
                    return direction === "asc"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                } else {
                    // If one value is a string and the other is a number, prioritize the number
                    if (isNaN(aValue) || isNaN(bValue)) {
                        return isNaN(aValue) ? -1 : 1; // String comes after number
                    }
                    // Both values are numbers, perform numeric comparison
                    return direction === "asc"
                        ? aValue - bValue
                        : bValue - aValue;
                }
            }
            return 0;
        });

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
                <div className="mt-4 overflow-y-scroll h-[450px] rounded-md">
                    <div className="grid top-0 sticky bg-[#dedddd] text-black grid-cols-[0.4fr_0.2fr_0.2fr_0.3fr_0.2fr_0.3fr_0.2fr]">
                        <div className="flex items-center px-3 py-3 text-sm font-semibold border-[#aaaaaa]">
                            Title{" "}
                            <span onClick={() => handleChangeSort("title")}>
                                {sortBy["title"] === "desc" ? (
                                    <IoIosArrowRoundUp size={20} />
                                ) : (
                                    <IoIosArrowRoundDown size={20} />
                                )}
                            </span>
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Publish year
                            <span
                                onClick={() =>
                                    handleChangeSort("first_publish_year")
                                }
                            >
                                {sortBy["first_publish_year"] === "desc" ? (
                                    <IoIosArrowRoundUp size={20} />
                                ) : (
                                    <IoIosArrowRoundDown size={20} />
                                )}
                            </span>
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Subject
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author DOB
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Author Top Work
                        </div>
                        <div className="px-3 flex items-center py-3 text-sm font-semibold border-[#aaaaaa]">
                            Average rating
                        </div>
                    </div>
                    {bookFetching || !author || authorLoading ? (
                        <>
                            <div className="text-3xl text-center mt-10">
                                Loading...
                            </div>
                            {search.length > 0 && bookError && (
                                <div className="text-2xl text-red-500 text-center mt-10">
                                    Something wnet wrong while getting your
                                    books
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {search.length === 0 && (
                                <div className="text-3xl text-center my-8 font-semibold">
                                    Search something.
                                </div>
                            )}
                            {search.length > 0 &&
                                sortedFilteredData.map((book, index) => (
                                    <div
                                        key={index}
                                        className="grid text-black grid-cols-[0.4fr_0.2fr_0.2fr_0.3fr_0.2fr_0.3fr_0.2fr]"
                                    >
                                        <div className="px-3  py-3 text-sm border-[#aaaaaa]">
                                            {book.title}
                                        </div>
                                        <div className="px-3  py-3 text-sm border-[#aaaaaa]">
                                            {book.author_name}
                                        </div>
                                        <div className="px-3 py-3 text-sm  border-[#aaaaaa]">
                                            {book.first_publish_year}
                                        </div>
                                        <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                            {book.subject}
                                        </div>
                                        <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                            {book.author_dob}
                                        </div>
                                        <div className="px-3 py-3 text-sm border-[#aaaaaa]">
                                            {book.author_topWork}
                                        </div>
                                        <div className="px-3 py-3  text-sm border-[#aaaaaa]">
                                            {book.ratings_average || "NA"}
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
                {!bookFetching && !authorLoading && author && (
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
                                Page:{" "}
                                <span className="font-semibold">{page}</span> of{" "}
                                <span className="font-semibold">
                                    {totalPage}
                                </span>
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
                )}
            </div>
        </div>
    );
}

export { Dashboard };
