import axios from 'axios';

const baseUrl = 'https://www.googleapis.com/books/v1';

export function getBooks(query, startIndex, maxResults) {
  const url = `${baseUrl}/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&projection=lite`;
  return axios.get(url);
}