export function getStrapiURL(path = "") {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337"
  }${path}`;
}

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(process.env.STRAPI_API_TOKEN 
          ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } 
          : {}),
    },
    ...options,
  };

  // Build request URL
  const queryString = Object.keys(urlParamsObject).length
    ? `?${new URLSearchParams(urlParamsObject).toString()}`
    : "";
  const requestUrl = getStrapiURL(`/api${path}${queryString}`);

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);

  // Handle response
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`An error occurred please try again`);
  }
  const data = await response.json();
  return data;
}

export async function getBooks() {
  const data = await fetchAPI('/books', { populate: '*' }, { cache: 'no-store' });
  return data;
}

export async function getBook(id: string | number) {
  const data = await fetchAPI(`/books/${id}`, { populate: '*' });
  return data;
}

export async function getUserLoans(userId?: number) {
  // If no userId is provided, we fetch loans for user ID 1 (mocking a logged-in user)
  const id = userId || 1;
  const data = await fetchAPI(`/loans`, {
    filters: {
      user: {
        id: {
          $eq: id,
        },
      },
    },
    populate: ['book'],
    sort: ['createdAt:desc'],
  }, { cache: 'no-store' });
  return data;
}
