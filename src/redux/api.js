import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const myApi = createApi({
    reducerPath: "myApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://openlibrary.org/",
    }),
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: ({limit, offset, book = "lord of the rings"}) => `search.json?title=${book}&offset=${offset}&limit=${limit}`,
        }),
        getAuthor: builder.query({
            query: (author) => `search/authors.json?q=${author}`,
        }),
    }),
});

export const { useGetBooksQuery, useLazyGetAuthorQuery } = myApi;
export { myApi };
