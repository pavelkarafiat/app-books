// TagFilter.js
export default {
  props: ['tags', 'currentFilter'],
  template: `
    <div id="menu">
      <button 
        v-for="tag in tags" 
        :key="tag.tag" 
        :class="{ 'active': tag.tag === currentFilter }" 
        @click="filterByTag(tag.tag)">
        {{ tag.tag }}: {{ tag.count }}
      </button>
    </div>
  `,
  methods: {
    filterByTag(tag) {
      this.$emit('filter', tag);
    }
  }
};
