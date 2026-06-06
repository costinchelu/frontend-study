interface BookV4 {
  title: string,
  author: string,
  numberOfPages: number;
}

const book9: BookV4 = { title: "The Time Machine", author: "H.G. Wells", numberOfPages: 144 };
const book10: BookV4 = { title: "Pride and Prejudice", author: "Jane Austen", numberOfPages: 304 };
const book11: BookV4 = { title: "Frankenstein", author: "Mary Shelley", numberOfPages: 353 };

function printBookTitles(...books: BookV4[]) {
  books.forEach(book => console.log(book.title));
}

printBookTitles(book9, book10, book11);

function printBookInfo2(book: BookV4): void {
  console.log(`${book.title} ${book.author} ${book.numberOfPages} pages`);
}

printBookInfo2(book9);

// destructure
function printBookInfo3({title, author, numberOfPages}: BookV4): void {
  console.log(`${title} ${author} ${numberOfPages} pages`);
}