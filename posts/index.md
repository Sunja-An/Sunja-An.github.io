---
layout: page
title: Posts
---

<div class="page-container">
  <div class="content">
    <div class="header">
      <h2>All Posts</h2>
      <span class="count">{{ posts.length }} posts</span>
    </div>
    <PostList :posts="posts" :categories="categories" />
  </div>
</div>

<style>
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

/* Content Styles */
.content {
  width: 100%;
}

.header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}

h2 {
  margin: 0 !important;
  font-size: 1.75rem;
  font-weight: 700;
  border: none;
  padding: 0;
}

.count {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}
</style>

<script setup>
import { ref } from 'vue'
import { data as posts } from './posts.data.ts'
import PostList from '../.vitepress/components/PostList.vue'

const categories = [
  { name: 'develop', color: '#3B82F6' },   // Blue
  { name: 'algorithm', color: '#A855F7' }, // Purple
  { name: 'CS', color: '#22C55E' },        // Green
  { name: 'DB', color: '#F97316' },        // Orange
  { name: 'test', color: '#EF4444' }       // Red
]
</script>
