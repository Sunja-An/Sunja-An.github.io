<script setup>
defineProps({
  posts: {
    type: Array,
    required: true
  }
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="post-grid">
    <a 
      v-for="post in posts" 
      :key="post.url" 
      :href="post.url" 
      class="post-card"
    >
      <div class="post-content">
        <h3 class="post-title">{{ post.frontmatter.title }}</h3>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
          <div v-if="post.frontmatter.tags" class="post-tags">
             <span v-for="tag in post.frontmatter.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <p v-if="post.frontmatter.description" class="post-description">
          {{ post.frontmatter.description }}
        </p>
      </div>
    </a>
  </div>
</template>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.post-card {
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none !important;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft-up);
}

.post-title {
  margin: 0 0 0.5rem 0 !important;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  background-color: var(--vp-c-bg-mute);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.post-description {
  margin: 0 !important;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Dark mode adjustments if needed, mostly handled by var(--vp-*) variables */
</style>
