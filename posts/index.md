---
layout: page
title: Posts
---

<div class="posts-container">

## All Posts

<PostList :posts="posts" />

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
</style>

<script setup>
import { data as posts } from './posts.data.ts'
import PostList from '../.vitepress/components/PostList.vue'
</script>
