<script setup>
import { computed, ref, watch } from 'vue'

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
  },
  // 'all' | 'ko' | 'ja'
  langFilter: {
    type: String,
    default: 'all'
  }
})

const currentPage = ref(1)

// 탭(langFilter)이 바뀌면 페이지를 1로 리셋
watch(() => props.langFilter, () => {
  currentPage.value = 1
})

const filteredPosts = computed(() => {
  if (props.langFilter === 'all') return props.posts
  return props.posts.filter(p => {
    const lang = p.frontmatter?.lang ?? 'ko'
    return lang === props.langFilter
  })
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / props.pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredPosts.value.slice(start, end)
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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getCategoryColor(categoryName) {
  const category = props.categories.find(c => c.name === categoryName)
  return category ? category.color : '#9a9a9a'
}
</script>

<template>
  <div>
    <!-- Empty state -->
    <div v-if="paginatedPosts.length === 0" class="empty-state">
      <p>No posts yet.</p>
    </div>

    <!-- Post list -->
    <ul v-else class="post-list">
      <li v-for="post in paginatedPosts" :key="post.url" class="post-item">
        <a :href="post.url" class="post-link">
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
            <span
              v-if="post.frontmatter.categories && post.frontmatter.categories[0]"
              class="post-tag"
              :style="{ color: getCategoryColor(post.frontmatter.categories[0]) }"
            >
              {{ post.frontmatter.categories[0] }}
            </span>
            <span
              v-if="post.frontmatter.lang"
              class="post-lang"
            >{{ post.frontmatter.lang === 'ja' ? '🇯🇵' : '🇰🇷' }}</span>
          </div>
          <h3 class="post-title">{{ post.frontmatter.title }}</h3>
          <p v-if="post.frontmatter.description" class="post-description">
            {{ post.frontmatter.description }}
          </p>
          <span class="post-arrow">→</span>
        </a>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1" class="pag-btn">← Prev</button>
      <div class="page-numbers">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="page-num"
          :class="{ active: currentPage === page }"
        >{{ page }}</button>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pag-btn">Next →</button>
    </div>
  </div>
</template>

<style scoped>
/* ── Post List ── */
.post-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.post-item {
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.15s;
}

.post-item:first-child {
  border-top: 1px solid var(--vp-c-divider);
}

.post-link {
  display: block;
  padding: 1.25rem 0.5rem;
  text-decoration: none !important;
  color: inherit;
  position: relative;
  transition: padding-left 0.2s ease;
}

.post-link:hover {
  padding-left: 0.75rem;
}

.post-link:hover .post-title {
  color: var(--vp-c-brand);
}

.post-link:hover .post-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Meta row */
.post-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.post-date {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
}

.post-tag {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.post-lang {
  font-size: 0.85rem;
}

/* Title */
.post-title {
  margin: 0 0 0.35rem 0 !important;
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  border: none !important;
  padding: 0 !important;
  letter-spacing: -0.02em;
  transition: color 0.2s;
}

/* Description */
.post-description {
  margin: 0 !important;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Arrow */
.post-arrow {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateX(-6px) translateY(-50%);
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  opacity: 0;
  transition: all 0.2s ease;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

/* ── Pagination ── */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
  gap: 0.75rem;
}

.pag-btn {
  padding: 0.4rem 0.85rem;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.15s;
}

.pag-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pag-btn:not(:disabled):hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-num {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.82rem;
  font-family: inherit;
  transition: all 0.15s;
}

.page-num:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-divider);
}

.page-num.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
  font-weight: 600;
}
</style>
