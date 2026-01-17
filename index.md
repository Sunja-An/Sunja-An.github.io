---
layout: home

hero:
  name: "SUNWOO AN"
  text: "周りに肯定的な影響を与える開発者"
  tagline: "Backend Developer"
  image:
    src: /profile.jpg
    alt: Sunja An Profile
  actions:
    - theme: brand
      text: Read Posts
      link: /posts/
    - theme: alt
      text: GitHub
      link: https://github.com/Sunja-An

---

<div class="home-content">
  <h2>Recent Posts</h2>
  <PostList :posts="posts" />
</div>

<script setup>
import PostList from './.vitepress/components/PostList.vue'
import { data as posts } from './posts/posts.data.ts'
</script>

<style>
:root {
  --vp-home-hero-image-filter: none;
}
.VPHero .image-src {
  border-radius: 8px;
}

.home-content {
  max-width: 1152px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

.home-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 3rem;
}
</style>
