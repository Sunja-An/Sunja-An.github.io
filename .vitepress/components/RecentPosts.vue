<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { data as posts } from '../../posts/posts.data.ts'
import PostList from './PostList.vue'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref(null)
let ctx

const categories = [
  { name: 'develop', color: '#6366f1' },
  { name: 'algorithm', color: '#8b5cf6' },
  { name: 'CS', color: '#0ea5e9' },
  { name: 'DB', color: '#f59e0b' },
  { name: 'test', color: '#ef4444' },
  { name: 'daily', color: '#64748b' }
]

// 단일 리스트로 최근 포스트 6개를 가져옴
const recentPosts = computed(() => posts.slice(0, 6))

onMounted(() => {
  if (!containerRef.value) return

  ctx = gsap.context((self) => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const header = self.selector('.recent-header')
      const items = self.selector('.post-item')
      gsap.set([header, items], { autoAlpha: 1, y: 0 })
    })

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const header = self.selector('.recent-header')
      const items = self.selector('.post-item')

      if (header && header.length > 0) {
        gsap.set(header, { autoAlpha: 0, y: 20 })
        gsap.to(header, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        })
      }

      if (items && items.length > 0) {
        gsap.set(items, { autoAlpha: 0, y: 25 })
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.value,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        })
      }
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div class="recent-section" ref="containerRef">
    <div class="recent-header">
      <div class="header-title-group">
        <h2 class="recent-title">Recent Posts</h2>
        <span class="recent-subtitle">Latest articles & insights</span>
      </div>
      <a href="/post/" class="view-all">View All →</a>
    </div>

    <!-- 단일 PostList 컴포넌트를 사용하여 한번에 깔끔하게 표기 -->
    <PostList :posts="recentPosts" :categories="categories" :page-size="6" />
  </div>
</template>

<style scoped>
.recent-section {
  max-width: 720px;
  margin: 3rem auto 0;
  padding: 0 1.5rem 6rem;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.recent-title {
  font-size: 1.35rem !important;
  font-weight: 700 !important;
  color: var(--vp-c-text-1);
  margin: 0 !important;
  border: none !important;
  padding: 0 !important;
  letter-spacing: -0.02em;
}

.recent-subtitle {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
}

.view-all {
  font-size: 0.85rem;
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.15s;
}

.view-all:hover {
  opacity: 0.75;
}
</style>
