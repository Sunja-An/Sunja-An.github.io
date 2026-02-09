<script setup lang="ts">
import { data as posts } from '../../posts/posts.data'

// Get the latest 5 posts
const recentPosts = posts.slice(0, 5)

function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="recent-posts-container">
    <h2 class="section-title">Latest Posts</h2>
    <div class="posts-grid">
      <a 
        v-for="post in recentPosts" 
        :key="post.url" 
        :href="post.url" 
        class="post-card"
      >
        <div class="post-content">
          <h3 class="post-title">{{ post.frontmatter.title }}</h3>
          <p v-if="post.excerpt" class="post-excerpt" v-html="post.excerpt"></p>
          <div class="post-meta">
            <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recent-posts-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  background: linear-gradient(120deg, var(--vp-c-brand), var(--vp-c-brand-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card {
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
  text-decoration: none !important;
}

.post-card:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft-up);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-excerpt {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
