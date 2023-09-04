const booksGrid = document.getElementById("booksGrid");

const myLibrary = [];

// Funzione per creare un oggetto libro
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// verifica se ci sono dati precedentemente memorizzati nella localStorage
const storedLibrary = localStorage.getItem('myLibrary');
if (storedLibrary) {
  myLibrary.push(...JSON.parse(storedLibrary));
}

// Funzione per aggiungere un libro all'array myLibrary
function addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    myLibrary.push(newBook);
    closeModal();
    displayBooks();
    updateLibraryInformation();
    updateLocalStorage();
}

// Funzione per mostrare i libri nell'array myLibrary
function displayBooks() {
  booksGrid.innerHTML = ""; // Pulisci il contenuto precedente

  myLibrary.forEach((book, index) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    const title = document.createElement("p");
    title.classList.add("title");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = book.author;

    const pages = document.createElement("p");
    pages.classList.add("pages");
    pages.textContent = book.pages + " " + 'pages';

    const btnBC = document.createElement("div");
    btnBC.classList.add("btnBC");

    const readBtn = document.createElement("button");
    readBtn.textContent = book.isRead ? "Read" : "Not Read";
    readBtn.classList.add("btn-card");

    function toggleReadStatus(index) {
        myLibrary[index].isRead = !myLibrary[index].isRead;
        displayBooks(); // Aggiorna la visualizzazione dei libri dopo il cambio di stato
        updateLibraryInformation();
        updateLocalStorage(); // Aggiorna la localStorage con il nuovo stato
    }

    readBtn.addEventListener("click", () => toggleReadStatus(index));

    const removeButton = document.createElement("button");
    removeButton.classList.add("btn-card");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeBook(index));

    btnBC.appendChild(readBtn);
    btnBC.appendChild(removeButton);
    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    bookCard.appendChild(btnBC);

    booksGrid.appendChild(bookCard);
  });
}

// Funzione per rimuovere un libro dall'array myLibrary
function removeBook(index) {
  myLibrary.splice(index, 1);
  updateLibraryInformation();
  displayBooks();
  updateLocalStorage();
}

// Funzione per aprire il modale di aggiunta di un libro
function openModal() {
  const addBookModal = document.getElementById("addBookModal");
  const overlay = document.getElementById("overlay");
  addBookModal.style.display = "block";
  overlay.style.display = "block";

  const errorMsg = document.getElementById("errorMsg");
  errorMsg.style.display = "none";
  errorMsg.textContent = "";

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("isRead").checked = false;
}

// Funzione per chiudere il modale di aggiunta di un libro
function closeModal() {
  const addBookModal = document.getElementById("addBookModal");
  const overlay = document.getElementById("overlay");
  addBookModal.style.display = "none";
  overlay.style.display = "none";
}

// Gestione del submit del modulo
const addBookForm = document.getElementById("addBookForm");
addBookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = parseInt(document.getElementById("pages").value);
  const isRead = document.getElementById("isRead").checked;

  if (bookDuplicate(title, author)) {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "block";
    errorMsg.textContent = "This book is already in your library!";
  } else if (title && author && pages) {
    addBookToLibrary(title, author, pages, isRead);
  } else {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "Please fill in all fields.";
  }

  updateLibraryInformation();
});

// evita i duplicati dei libri: considerando duplicato i libri con lo stesso autore e titolo. 
function bookDuplicate(title, author) {
  const lowerCaseTitle = title.toLowerCase(); // Converte il titolo in lettere minuscole prima di confrontare
  return myLibrary.some((book) => book.title.toLowerCase() === lowerCaseTitle && book.author.toLowerCase() === author.toLowerCase());
}

// Apri il modale quando il pulsante "+ Add book" viene cliccato
const addBookBtn = document.getElementById("addBookBtn");
addBookBtn.addEventListener("click", openModal);

// Chiudi il modale quando l'overlay viene cliccato
const overlay = document.getElementById("overlay");
overlay.addEventListener("click", closeModal);

// Information section
function updateLibraryInformation() {
  const totalBooksElement = document.getElementById("total-books");
  const booksReadElement = document.getElementById("books-read");
  const pagesReadElement = document.getElementById("pages-read");
  const booksUnreadElement = document.getElementById("books-unread");

  const totalBooks = myLibrary.length;
  const booksRead = myLibrary.filter((book) => book.isRead).length;
  const pagesRead = myLibrary.reduce((total, book) => {
    return total + (book.isRead ? book.pages : 0);
  }, 0);
  const booksUnread = totalBooks - booksRead;

  totalBooksElement.textContent = totalBooks;
  booksReadElement.textContent = booksRead;
  pagesReadElement.textContent = pagesRead;
  booksUnreadElement.textContent = booksUnread;
}

updateLibraryInformation();
displayBooks();

// Funzione per aggiornare la localStorage con l'array myLibrary
function updateLocalStorage() {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}