// TagFilter.js
export default {
  props: ['tags', 'currentFilter'],
  template:/*javascript*/`
  <div id="menu">
      <button 
        v-for="el in tags" 
        :key="el.tag" 
        :class="{ 'active': el.tag === currentFilter }" 
        @click="filterByTag(el.tag)">
        {{ el.tag }}: {{ el.count }}
      </button>
    </div>`,
  methods: {
    filterByTag(el) {
      this.$emit('filter', el);
    }
  }
};
