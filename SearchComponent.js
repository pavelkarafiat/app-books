export default {
    data() {
      return {
        searchQuery: ''
      };
    },
    template: 
      /*javascript*/`
      <div class="search-component">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="updateSearch" 
          placeholder="Search books..."
        />
      </div>
    `,
    methods: {
      updateSearch() {
        this.$emit('search-updated', this.searchQuery); // Emit the current search query to the parent
      }
    }
  };
  