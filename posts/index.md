---
layout: page
title: Posts
---

<div class="posts-container">

## All Posts

<div class="tags-container">
  <button 
    class="tag-btn" 
    :class="{ active: selectedTag === null }"
    @click="selectedTag = null"
  >
    All
  </button>
  <button 
    v-for="tag in uniqueTags" 
    :key="tag" 
    class="tag-btn"
    :class="{ active: selectedTag === tag }"
    @click="selectedTag = tag"
  >
    {{ tag }}
  </button>
</div>

<PostList :posts="filteredPosts" />

</div>

<style>
.posts-container {
  padding: 2rem;
}
h2 {
  font-weight: 800;
  font-size: 2rem;
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.tag-btn.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { data as posts } from './posts.data.ts'
import PostList from '../.vitepress/components/PostList.vue'

const selectedTag = ref(null)

const uniqueTags = computed(() => {
  const tags = new Set()
  posts.forEach(post => {
    if (post.frontmatter.tags) {
      post.frontmatter.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return posts
  }
  return posts.filter(post => 
    post.frontmatter.tags && post.frontmatter.tags.includes(selectedTag.value)
  )
})
</script>
