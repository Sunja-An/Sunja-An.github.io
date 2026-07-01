<script setup>
const careers = [
  {
    title: 'CyberAgent',
    role: 'Backend Developer',
    period: '2026.09.01 ~',
    tech: [],
    link: 'https://www.cyberagent.co.jp/'
  }
]
</script>

<template>
  <div class="projects-grid">
    <a 
      v-for="career in careers" 
      :key="career.title" 
      :href="career.link"
      :target="career.link && career.link.startsWith('http') ? '_blank' : '_self'"
      :rel="career.link && career.link.startsWith('http') ? 'noopener noreferrer' : ''"
      class="project-card"
    >
      <div class="card-header">
        <h3 class="project-title">
          {{ career.title }}
          <span v-if="career.role" class="role-badge">{{ career.role }}</span>
        </h3>
        <span class="period">{{ career.period }}</span>
      </div>
      
      <div v-if="career.tech && career.tech.length > 0" class="tech-stack">
        <span v-for="tech in career.tech" :key="tech" class="tech-tag">{{ tech }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.project-card {
  display: block;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none !important;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft-up);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-title {
  margin: 0 !important;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-dark);
  font-weight: 600;
}

.period {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}

.project-card:hover .tech-tag {
  color: var(--vp-c-text-1);
}
</style>
