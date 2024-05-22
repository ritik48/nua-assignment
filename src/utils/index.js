const bookWithAuthor = (authorData, books) => {
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

    return tempBookData;
};

const sortedBooks = (bookData, sortBy) => {
    const sortedData = [...bookData].sort((a, b) => {
        for (const column in sortBy) {
            const direction = sortBy[column];
            const aValue = a[column];
            const bValue = b[column];

            if (aValue === "NA" && bValue !== "NA") {
                return 1;
            }
            if (aValue !== "NA" && bValue === "NA") {
                return -1;
            }
            if (aValue === bValue) continue;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            } else {
                if (isNaN(aValue) || isNaN(bValue)) {
                    return isNaN(aValue) ? -1 : 1;
                }
                return direction === "asc" ? aValue - bValue : bValue - aValue;
            }
        }
        return 0;
    });

    return sortedData;
};

export { bookWithAuthor, sortedBooks };
