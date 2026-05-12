---
layout: page
title: Posts
---

<div class="posts-page">
  <div class="page-header">
    <h1 class="page-title">Posts</h1>
    <p class="page-subtitle">{{ posts.length }} articles</p>
  </div>

  <!-- Language Tabs -->
  <div class="lang-tabs">
    <button
      class="tab-btn"
      :class="{ active: activeLang === 'all' }"
      @click="setLang('all')"
    >All</button>
    <button
      class="tab-btn"
      :class="{ active: activeLang === 'ko' }"
      @click="setLang('ko')"
    >
      <span>🇰🇷</span> 한국어
    </button>
    <button
      class="tab-btn"
      :class="{ active: activeLang === 'ja' }"
      @click="setLang('ja')"
    >
      <span>🇯🇵</span> 日本語
    </button>
  </div>

  <!-- Post count for active filter -->
  <div class="filter-info">
    <span class="filter-count">{{ filteredCount }} posts</span>
  </div>

  <PostList :posts="posts" :categories="categories" :lang-filter="activeLang" />
</div>

<style>
.posts-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1.5rem 8rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem !important;
  font-weight: 700 !important;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
  margin: 0 0 0.25rem 0 !important;
  border: none !important;
  padding: 0 !important;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0 !important;
}

/* Language tabs */
.lang-tabs {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.875rem;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  border-radius: 0;
}

.tab-btn:hover {
  color: var(--vp-c-text-1);
}

.tab-btn.active {
  color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
  font-weight: 600;
}

.filter-info {
  margin-bottom: 0.25rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
}

.filter-count {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { data as posts } from './posts.data.ts'
import PostList from '../.vitepress/components/PostList.vue'

const categories = [
  { name: 'develop', color: '#6366f1' },
  { name: 'algorithm', color: '#8b5cf6' },
  { name: 'CS', color: '#0ea5e9' },
  { name: 'DB', color: '#f59e0b' },
  { name: 'test', color: '#ef4444' },
  { name: 'Daily', color: '#64748b' }
]

const activeLang = ref('all')

function setLang(lang) {
  activeLang.value = lang
}

const filteredCount = computed(() => {
  if (activeLang.value === 'all') return posts.length
  return posts.filter(p => (p.frontmatter?.lang ?? 'ko') === activeLang.value).length
})
</script>
