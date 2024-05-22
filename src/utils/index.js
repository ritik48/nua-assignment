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
            title: book.title,
            author_name: book.author_name[0],
            first_publish_year: book.first_publish_year,
            subject: book.subject ? book.subject[0] : "NA",
            author_dob: dob,
            author_topWork: topWork,
            ratings_average: book.ratings_average,
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

const convertToCSV = (data) => {
    if (data.length === 0) return "";

    const columns = [
        "title",
        "author",
        "publish year",
        "subject",
        "author dob",
        "author top work",
        "average rating",
    ];

    const headers = columns.join(",");
    const rows = data.map((row) =>
        [
            row.title,
            row.author_name,
            row.first_publish_year,
            row.subject,
            row.author_dob,
            row.author_topWork,
            row.ratings_average,
        ].join(",")
    );
    return [headers, ...rows].join("\n");
};

const downloadCSV = (data) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export { bookWithAuthor, sortedBooks, downloadCSV };
