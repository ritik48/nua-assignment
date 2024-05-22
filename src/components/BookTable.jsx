/* eslint-disable react/prop-types */
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

export function BookTable({
    handleChangeSort,
    bookFetching,
    author,
    authorLoading,
    sortBy,
    sortedFilteredData,
    search,
    bookError,
}) {
    return (
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
                        onClick={() => handleChangeSort("first_publish_year")}
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
                    <div className="text-3xl text-center mt-10">Loading...</div>
                    {search.length > 0 && bookError && (
                        <div className="text-2xl text-red-500 text-center mt-10">
                            Something wnet wrong while getting your books
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
    );
}
