const AuthorBooksView = {
    render: async () => {
        return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Mis Libros</h1>
        <button class="btn btn-primary" onclick="Toast.show('Publicar libro', 'info')">Publicar</button>
      </div>
      <div id="authorBooksGrid" class="books-grid"></div>
    `;
    },
    afterRender: async () => {
        const user = Storage.getAuth().user;
        const authorName = `${user.firstName} ${user.lastName}`;
        const books = MockData.books.filter(b => b.authorName === authorName);

        document.getElementById('authorBooksGrid').innerHTML = books.map(b => BookCard.render(b)).join('');
    }
};
