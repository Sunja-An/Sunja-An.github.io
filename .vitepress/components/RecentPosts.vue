<script setup>
import { data as posts } from '../../posts/posts.data.ts'
import PostList from './PostList.vue'

const recentPosts = posts.slice(0, 5)

const categories = [
  { name: 'develop', color: '#3B82F6' },   // Blue
  { name: 'algorithm', color: '#A855F7' }, // Purple
  { name: 'CS', color: '#22C55E' },        // Green
  { name: 'DB', color: '#F97316' },        // Orange
  { name: 'test', color: '#EF4444' }       // Red
]
</script>

<template>
  <div class="recent-posts-container">
    <div class="section-header">
      <h2>Recent Posts</h2>
      <a href="/posts/" class="view-all">View All →</a>
    </div>
    <PostList :posts="recentPosts" :categories="categories" />
  </div>
</template>

<style scoped>
.recent-posts-container {
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  border: none;
}

.view-all {
  font-size: 0.95rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all:hover {
  text-decoration: underline;
  color: var(--vp-c-brand-dark);
}
</style>
