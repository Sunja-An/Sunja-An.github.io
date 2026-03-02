<script setup>
const projects = [
  {
    title: 'COU',
    role: 'Backend',
    period: '2024.03 ~',
    tech: ['Java', 'Java SpringBoot4', 'MySQL', 'Docker'],
    link: '/projects/cou'
  },
  {
    title: 'GAMERS-BE',
    role: 'Backend',
    period: '2025.12 ~',
    tech: ['Go (Gin)', 'Gorm', 'MySQL:8.0', 'Docker', 'docker-compose', 'redis:7.4', 'RabbitMQ:4.1', 'go-migrate', 'TestContainer', 'GCP'],
    link: 'https://github.com/FOR-GAMERS/GAMERS-BE'
  },
  {
    title: 'jobmanri-BE',
    role: 'Backend',
    period: '2025.11 ~ 2025.12',
    tech: ['Java 21', 'Java SpringBoot3', 'MySQL:8.0', 'JUnit5', 'TestContainer', 'Docker'],
    link: 'https://github.com/jobmanri/be'
  },
  {
    title: 'Journey-Planner',
    role: 'Backend',
    period: '2025.09 ~ 2025.11',
    tech: ['Java 17', 'Java SpringBoot3', 'MySQL:8.0', 'JUnit5', 'Docker'],
    link: 'https://github.com/kakao-tech-campus-3rd-step3/Team8_BE'
  },
  {
    title: 'Basilium',
    role: 'Frontend',
    period: '2025.07 ~ 2025.09',
    tech: ['React.js', 'styled-components', 'Nginx', 'AWS EC2'],
    link: 'https://github.com/Sunja-An/Basilium'
  }
]
</script>

<template>
  <div class="projects-grid">
    <a 
      v-for="project in projects" 
      :key="project.title" 
      :href="project.link"
      :target="project.link.startsWith('http') ? '_blank' : '_self'"
      :rel="project.link.startsWith('http') ? 'noopener noreferrer' : ''"
      class="project-card"
    >
      <div class="card-header">
        <h3 class="project-title">
          {{ project.title }}
          <span v-if="project.role" class="role-badge">{{ project.role }}</span>
        </h3>
        <span class="period">{{ project.period }}</span>
      </div>
      
      <div class="tech-stack">
        <span v-for="tech in project.tech" :key="tech" class="tech-tag">{{ tech }}</span>
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
