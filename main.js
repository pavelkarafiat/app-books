// main.js
import BookEntry from './BookEntry.js';
import TagFilter from './TagFilter.js';
import TopAuthors from './TopAuthors.js'; 

Vue.component('book-entry', BookEntry);
Vue.component('tag-filter', TagFilter);
Vue.component('top-authors', TopAuthors); 


new Vue({
  el: '#app',
  data: {
    books: [],
    allTags: [],
    currentFilter: 'all'
  },
  computed: {
    filteredBooks() {
      if (this.currentFilter === 'all') {
        return this.books;
      } else {
        return this.books.filter(book => book.tagy.split(',').map(tag => tag.trim()).includes(this.currentFilter));
      }
    }
  },
  methods: {
    async fetchBooks() {
      try {
        //const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpsmdU_Esx3BZPjbRLtK8uVKqcm2-5nMtYzjcuyAWez86H3TlJGFKS2-ooy3e4WuP4FxLjyJJza4H9/pub?gid=0&single=true&output=tsv');
        const response = await fetch('./knihy.tsv');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        const rows = text.split('\n').slice(1);
        this.books = rows.map(row => {
          const [autor, nazev, original, precteno, vydano, imglink, tagy, popis] = row.split('\t');
          return { autor, nazev, original, precteno, vydano, imglink, tagy, popis };
        }).reverse();
        this.allTags = this.getOrderedTags(this.books);  // Process tags once books are fetched
      } catch (error) {
        console.error("Failed to fetch books: ", error);
        // Optionally handle the error in the UI, e.g., show an error message
      }
    },
    getOrderedTags(books) {
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
      alltags.unshift({ tag: 'all', count: books.length }); // Include 'All' option
      return alltags;
    },
    setFilter(tag) {
      this.currentFilter = tag;
    }
  },
  created() {
    this.fetchBooks();
  }
});
