<script setup>
import { ref, computed } from 'vue'
import { data as posts } from '../../posts/posts.data.ts'
import PostList from './PostList.vue'

const categories = [
  { name: 'develop', color: '#6366f1' },
  { name: 'algorithm', color: '#8b5cf6' },
  { name: 'CS', color: '#0ea5e9' },
  { name: 'DB', color: '#f59e0b' },
  { name: 'test', color: '#ef4444' },
  { name: 'Daily', color: '#64748b' }
]

const koPosts = computed(() =>
  posts.filter(p => (p.frontmatter?.lang ?? 'ko') === 'ko').slice(0, 3)
)

const jaPosts = computed(() =>
  posts.filter(p => p.frontmatter?.lang === 'ja').slice(0, 3)
)
</script>

<template>
  <div class="recent-section">
    <!-- Korean Posts -->
    <div class="lang-block">
      <div class="lang-header">
        <div class="lang-label">
          <span class="flag">🇰🇷</span>
          <span class="lang-title">한국어 포스트</span>
        </div>
        <a href="/posts/?lang=ko" class="view-all">전체 보기 →</a>
      </div>
      <PostList :posts="koPosts" :categories="categories" :page-size="3" />
    </div>

    <!-- Divider -->
    <div class="section-divider"></div>

    <!-- Japanese Posts -->
    <div class="lang-block">
      <div class="lang-header">
        <div class="lang-label">
          <span class="flag">🇯🇵</span>
          <span class="lang-title">日本語ポスト</span>
        </div>
        <a href="/posts/?lang=ja" class="view-all">すべて見る →</a>
      </div>
      <PostList :posts="jaPosts" :categories="categories" :page-size="3" />
    </div>
  </div>
</template>

<style scoped>
.recent-section {
  max-width: 720px;
  margin: 3rem auto 0;
  padding: 0 1.5rem 6rem;
}

.lang-block {
  margin-bottom: 0;
}

.lang-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.lang-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flag {
  font-size: 1.1rem;
}

.lang-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.view-all {
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.15s;
}

.view-all:hover {
  opacity: 0.7;
}

.section-divider {
  height: 1px;
  background-color: var(--vp-c-divider);
  margin: 2.5rem 0;
}
</style>
