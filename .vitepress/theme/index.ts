import DefaultTheme from 'vitepress/theme'
import Comments from '../components/Comments.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Comments),
      'sidebar-nav-after': () => h('div', { 
        class: 'sidebar-copyright',
        style: { 
          textAlign: 'center', 
          padding: '1rem', 
          fontSize: '12px', 
          color: 'var(--vp-c-text-3)',
          borderTop: '1px solid var(--vp-c-divider)',
          marginTop: '1rem'
        } 
      }, 'Copyright © 2025 Sunja An')
    })
  }
}
