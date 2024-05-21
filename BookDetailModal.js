// BookDetailModal.js
export default {
    props: ['book', 'visible'],
    template: /*javascript*/`
      <div v-if="visible" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>{{ book.autor }}</h2>
          <h3>{{ book.nazev }}</h3>
          <img :src="'img/' + book.imglink" @load="handleImageLoad($event)" loading="lazy">
          <p><strong>Read:</strong> {{ book.precteno }}</p>
          <p><strong>Published:</strong> {{ book.vydano }}</p>
          <p><strong>Description:</strong> {{ book.popis }}</p>
          <p><strong>Tags:</strong> {{ book.tagy }}</p>
        </div>
      </div>
    `,
    methods: {
      closeModal() {
        this.$emit('close');
      },
      handleImageLoad(event) {
        event.target.style.opacity = 1;
      }
    }
  };



  