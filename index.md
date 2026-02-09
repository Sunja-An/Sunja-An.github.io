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

<RecentPosts />

<style>
:root {
  --vp-home-hero-image-filter: none;
}
.VPHero .image-src {
  border-radius: 8px;
}

.home-sections {
  max-width: 1152px;
  margin: 0 auto;
  padding: 4rem 1.5rem 10rem;
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.section-block {
  text-align: center;
  padding: 4rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  position: relative;
}

/* Optional: Add a subtle divider or styling between sections */
.section-block:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: -3rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: var(--vp-c-divider);
}

.section-block p {
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  margin: 0;
  background: linear-gradient(120deg, var(--vp-c-brand), var(--vp-c-brand-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
