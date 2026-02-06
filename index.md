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
  <div class="intro-section">
    <p>즐거운 개발을 하고 싶어.</p>
    <p>사람들에게 긍정적인 영향을 주는 개발자가 되고 싶어.</p>
    <p>나만의 스토리를 쓰고 싶다.</p>
  </div>
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
  padding: 4rem 1.5rem 10rem;
}

/* .home-content h2 removed */

.intro-section {
  text-align: center;
  margin-bottom: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.intro-section p {
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
}
</style>
