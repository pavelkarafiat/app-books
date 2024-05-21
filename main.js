// main.js
import BookEntry from './BookEntry.js';
import TagFilter from './TagFilter.js';
import TopAuthors from './TopAuthors.js'; 
import BookDetailModal from './BookDetailModal.js'; 

// Create a new Vue application using the global Vue instance
const app = Vue.createApp({
  data() {
    return {
      books: [],
      allTags: [],
      currentFilter: 'all',
      searchQuery: '',
      selectedBook: null, // Holds the book object for the modal
      showModal: false, // Controls visibility of the modal  
    };
  },
  computed: {
    filteredBooks() {
      let result = this.books;
      if (this.currentFilter !== 'all') {
        result = result.filter(book => book.tagy.split(',').map(tag => tag.trim()).includes(this.currentFilter));
      }
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(book =>
          book.autor.toLowerCase().includes(searchLower) ||
          book.nazev.toLowerCase().includes(searchLower) 
        );
      }
      return result;
    }
  },
  methods: {
    async fetchBooks() {
        //const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpsmdU_Esx3BZPjbRLtK8uVKqcm2-5nMtYzjcuyAWez86H3TlJGFKS2-ooy3e4WuP4FxLjyJJza4H9/pub?gid=0&single=true&output=tsv');
        const response = await fetch('./knihy.tsv');
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        this.books = rows.map(row => {
          const [autor, nazev, original, precteno, vydano, imglink, tagy, popis] = row.split('\t');
          return { autor, nazev, original, precteno, vydano, imglink, tagy, popis };
        }).reverse();
        this.allTags = this.getTags(this.books);
    },
    getTags(books) {
      let alltags = [];
      books.forEach(book => {
        book.tagy.split(',').forEach(tag => {
          tag = tag.trim();
          let found = alltags.find(t => t.tag === tag);
          if (!found) {
            alltags.push({ tag, count: 1 });
          } else {
            found.count++;
          }
        });
      });
      alltags.sort((a, b) => b.count - a.count);
      alltags.unshift({ tag: 'all', count: books.length });
      return alltags;
    },
    setFilter(tag) {
      this.currentFilter = tag;
      this.searchQuery = '';
    },
    openModal(book) {
      this.selectedBook = book;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
  created() {
    this.fetchBooks();
    
  }
});

// Register components
app.component('book-entry', BookEntry);
app.component('tag-filter', TagFilter);
app.component('top-authors', TopAuthors);
app.component('book-detail-modal', BookDetailModal);

// Mount the app
app.mount('#app');
