<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useData } from 'vitepress'

// Dark mode
const { isDark } = useData()
function toggleDark() {
  isDark.value = !isDark.value
}

// Refs for animation targets
const heroRef    = ref(null)
const imageRef   = ref(null)
const badgeRef   = ref(null)
const nameRef    = ref(null)
const descRef    = ref(null)
const stackRef   = ref(null)
const actionsRef = ref(null)
const orb1Ref    = ref(null)
const orb2Ref    = ref(null)
const topBarRef  = ref(null)

const stack = ['Go', 'Java', 'TypeScript', 'Spring Boot', 'Docker', 'MySQL']

onMounted(() => {
  const targets = [
    topBarRef.value, imageRef.value, badgeRef.value, nameRef.value,
    descRef.value, stackRef.value, actionsRef.value
  ]

  gsap.set(targets, { opacity: 0 })
  gsap.set([imageRef.value], { scale: 0.85, y: 20 })
  gsap.set([topBarRef.value], { y: -16 })
  gsap.set([badgeRef.value, nameRef.value, descRef.value, stackRef.value, actionsRef.value], { y: 30 })

  // Floating orbs idle animation (starts immediately)
  gsap.to(orb1Ref.value, {
    y: -28, x: 14, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true
  })
  gsap.to(orb2Ref.value, {
    y: 22, x: -18, duration: 8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1
  })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.to(topBarRef.value,  { opacity: 1, y: 0, duration: 0.5 })
    .to(imageRef.value,   { opacity: 1, scale: 1, y: 0, duration: 0.9 }, '-=0.2')
    .to(badgeRef.value,   { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
    .to(nameRef.value,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to(descRef.value,    { opacity: 1, y: 0, duration: 0.55 }, '-=0.3')
    .to(stackRef.value,   { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
    .to(actionsRef.value, { opacity: 1, y: 0, duration: 0.55 }, '-=0.2')

  // Subtle floating for profile image after entrance
  tl.to(imageRef.value, {
    y: -8, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true
  }, '+=0.2')
})
</script>

<template>
  <div class="hero-wrapper" ref="heroRef">

    <!-- Top bar: site title + dark toggle -->
    <div class="top-bar" ref="topBarRef">
      <span class="site-title">Sunja-An Blog</span>
      <button class="dark-toggle" @click="toggleDark" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <!-- Sun icon -->
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon icon -->
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>

    <!-- Ambient orbs -->
    <div class="orb orb-1" ref="orb1Ref"></div>
    <div class="orb orb-2" ref="orb2Ref"></div>

    <!-- Profile image -->
    <div class="profile-image-wrap" ref="imageRef">
      <img src="/profile.jpg" alt="Sunwoo An" class="profile-image" />
      <div class="image-ring"></div>
    </div>

    <!-- Badge -->
    <div class="badge" ref="badgeRef">
      <span class="badge-dot"></span>
      Backend Developer
    </div>

    <!-- Name -->
    <h1 class="hero-name" ref="nameRef">Sunwoo An</h1>

    <!-- Description -->
    <p class="hero-desc" ref="descRef">
      周りに肯定的な影響を与える開発者
    </p>

    <!-- Tech stack pills -->
    <div class="stack-wrap" ref="stackRef">
      <span v-for="s in stack" :key="s" class="stack-pill">{{ s }}</span>
    </div>

    <!-- Actions -->
    <div class="actions" ref="actionsRef">
      <a href="/posts/" class="btn-primary">
        Posts
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <a href="https://github.com/Sunja-An" target="_blank" rel="noopener" class="btn-ghost">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
        GitHub
      </a>
      <a href="/about" class="btn-ghost">
        About
      </a>
    </div>

  </div>
</template>

<style scoped>
/* ── Wrapper ── */
.hero-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 5rem 1.5rem 6rem;
  overflow: hidden;
  text-align: center;
}

/* ── Top bar ── */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  z-index: 10;
}

.site-title {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.dark-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.dark-toggle:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background: rgba(99, 102, 241, 0.08);
  transform: scale(1.08);
}

/* ── Ambient orbs ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%);
  top: 10%;
  left: -10%;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, transparent 70%);
  bottom: 15%;
  right: -8%;
}

.dark .orb-1 {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
}

.dark .orb-2 {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%);
}

/* ── Profile image ── */
.profile-image-wrap {
  position: relative;
  z-index: 1;
  margin-bottom: 1.75rem;
  width: 120px;
  height: 120px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.image-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(99, 102, 241, 0.6),
    rgba(139, 92, 246, 0.4),
    rgba(99, 102, 241, 0)
  );
  animation: spin 6s linear infinite;
  z-index: 1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Badge ── */
.badge {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.85rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-2);
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

/* ── Name ── */
.hero-name {
  position: relative;
  z-index: 1;
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, var(--vp-c-text-1) 30%, var(--vp-c-text-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .hero-name {
  background: linear-gradient(135deg, #ffffff 30%, #808080 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Description ── */
.hero-desc {
  position: relative;
  z-index: 1;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1.75rem 0;
  letter-spacing: 0.01em;
  line-height: 1.6;
  max-width: 420px;
}

/* ── Stack pills ── */
.stack-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.45rem;
  margin-bottom: 2.25rem;
  max-width: 480px;
}

.stack-pill {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
  transition: all 0.15s ease;
}

.stack-pill:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  background: rgba(99, 102, 241, 0.06);
}

/* ── Actions ── */
.actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Primary button */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  background: var(--vp-c-brand);
  color: #fff !important;
  text-decoration: none !important;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 10px;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary svg {
  transition: transform 0.2s ease;
}

.btn-primary:hover svg {
  transform: translateX(3px);
}

/* Ghost button */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.2rem;
  background: transparent;
  color: var(--vp-c-text-1) !important;
  text-decoration: none !important;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  border-color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  transform: translateY(-1px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .hero-wrapper {
    min-height: 100vh;
    padding: 5rem 1.25rem 4rem;
  }

  .top-bar {
    padding: 1rem 1.25rem;
  }

  .profile-image,
  .profile-image-wrap {
    width: 100px;
    height: 100px;
  }

  .hero-name {
    font-size: 2.25rem;
  }

  .hero-desc {
    font-size: 0.9rem;
  }
}
</style>
