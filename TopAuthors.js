export default {
    props: ['books'],
    computed: {
      topAuthors() {
        const authorCounts = {};
        // Count each occurrence of an author in the books array
        this.books.forEach(book => {
          const author = book.autor;
          if (authorCounts[author]) {
            authorCounts[author] += 1; // Increment count for each occurrence
          } else {
            authorCounts[author] = 1; // Initialize if not already in the object
          }
        });
  
        // Convert the counts object into an array, sort it, and take the top five
        const sortedAuthors = Object.entries(authorCounts)
          .sort((a, b) => b[1] - a[1]) // Sort authors by count descending
          .slice(0, 20) // Select the top authors
          .map(item => ({ name: item[0], count: item[1] }));
  
        return sortedAuthors;
      }
    },
    template: `
      <div class="top-authors">
        <h2>Featured Authors</h2>
          <span class="" v-for="author in topAuthors" :key="author.name">
            {{ author.name }} – {{ author.count }} x,
          </span>
      </div>
    `
  };
  