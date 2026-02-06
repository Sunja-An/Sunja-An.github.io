<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: false,
    default: () => []
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(props.posts.length / props.pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.posts.slice(start, end)
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToPage(page) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getCategoryColor(categoryName) {
  const category = props.categories.find(c => c.name === categoryName)
  return category ? category.color : 'var(--vp-c-text-3)' // Default color if not found
}
</script>

<template>
  <div class="post-list">
    <article 
      v-for="post in paginatedPosts" 
      :key="post.url" 
      class="post-card"
    >
      <a :href="post.url" class="post-link">
        <div class="post-content">
          <h3 class="post-title">{{ post.frontmatter.title }}</h3>
          <p v-if="post.frontmatter.description" class="post-description">
            {{ post.frontmatter.description }}
          </p>
        </div>
        
        <div class="post-footer">
          <div class="post-category" v-if="post.frontmatter.categories && post.frontmatter.categories[0]">
             <span 
              class="category-dot"
              :style="{ backgroundColor: getCategoryColor(post.frontmatter.categories[0]) }"
            ></span>
            <span class="category-name">{{ post.frontmatter.categories[0] }}</span>
          </div>
          <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
        </div>
      </a>
    </article>
  </div>

  <div class="pagination" v-if="totalPages > 1">
    <button 
      @click="prevPage" 
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      Previous
    </button>
    
    <div class="page-numbers">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="goToPage(page)"
        class="page-number"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>

    <button 
      @click="nextPage" 
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: rgb(246, 246, 247);
  border: 1px solid rgb(194, 194, 196); 
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  height: 100%;
}

/* Dark mode overrides if needed, assuming default theme variables handle some, but enforcing specific colors as requested */
:root.dark .post-card {
  background-color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.post-link {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem 1.25rem; /* Reduced padding slightly to match tight look */
  text-decoration: none !important;
  color: inherit;
  height: 100%;
}

.post-content {
  margin-bottom: 2rem; /* Spacing between text and footer */
}

.post-title {
  margin: 0 0 0.5rem 0 !important;
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(60, 60, 67);
  line-height: 1.4;
  border: none;
  padding: 0;
}

:root.dark .post-title {
  color: var(--vp-c-text-1);
}

.post-description {
  margin: 0 !important;
  font-size: 0.95rem;
  color: rgb(103, 103, 108);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:root.dark .post-description {
  color: var(--vp-c-text-2);
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-top: auto; /* Pushes footer to bottom if we were using flex-grow on content */
}

.post-category {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: rgb(60, 60, 67);
  font-weight: 500;
}

:root.dark .post-category {
  color: var(--vp-c-text-2);
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.post-date {
  color: rgb(103, 103, 108);
}

:root.dark .post-date {
  color: var(--vp-c-text-3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.page-number:hover {
  color: var(--vp-c-brand);
}

.page-number.active {
  background-color: var(--vp-c-brand);
  color: white;
}
</style>
