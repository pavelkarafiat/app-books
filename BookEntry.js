export default {
    props: ['data'],
    template: `
      <div class="entry-books">
        <img :src="'img/' + data.imglink" :style="{opacity: 0}" @load="handleImageLoad" loading="lazy">
        <div class="years">
          <span>{{ data.precteno }}</span>
          <span>{{ data.vydano }}</span>
        </div>
        <h2>{{ data.autor }}</h2>
        <h3>{{ data.nazev }}</h3>
        <div class="tags">
          <span v-for="tag in data.tagy.split(',')" :key="tag">{{ tag.trim() }}</span>
        </div>
      </div>
    `,
    methods: {
      handleImageLoad(event) {
        event.target.style.opacity = 1;
        event.target.style.transition = 'opacity 1s ease-out';
      }
    }
  };
  