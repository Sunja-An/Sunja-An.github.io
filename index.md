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

<HomeCategories />

<script setup>
import HomeCategories from './.vitepress/components/HomeCategories.vue'
</script>

<style>
:root {
  --vp-home-hero-image-filter: none;
}
.VPHero .image-src {
  border-radius: 8px;
}
</style>
