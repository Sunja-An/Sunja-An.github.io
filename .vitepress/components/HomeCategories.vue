<script setup>
import { withBase } from 'vitepress'

const categories = [
  {
    title: 'Tech',
    desc: 'Web development, coding, and technology.',
    link: '/posts/' // For now linking to posts list, ideally filter by category
  },
  {
    title: 'Life',
    desc: 'Personal thoughts and experiences.',
    link: '/posts/'
  }
]
</script>

<template>
  <div class="categories-container">
    <a 
      v-for="cat in categories" 
      :key="cat.title" 
      :href="withBase(cat.link)"
      class="category-card"
    >
      <div class="card-content">
        <h3>{{ cat.title }}</h3>
        <p>{{ cat.desc }}</p>
      </div>
    </a>
  </div>
</template>

<style scoped>
.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  max-width: 1152px;
  margin: 0 auto;
}

.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 16px;
  text-decoration: none !important;
  overflow: hidden;
  transition: all 0.4s ease;
  
  /* Glassmorphism Effect */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.dark .category-card {
  background: rgba(30, 30, 30, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-color: var(--vp-c-brand);
  background: rgba(255, 255, 255, 0.2);
}

.dark .category-card:hover {
  background: rgba(50, 50, 50, 0.5);
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.card-content p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
}
</style>
