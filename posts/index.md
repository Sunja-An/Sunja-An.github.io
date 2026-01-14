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
  padding: 8px;
}
h2 {
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
</style>

<script setup>
import { data as posts } from './posts.data.ts'
import PostList from '../.vitepress/components/PostList.vue'
</script>
