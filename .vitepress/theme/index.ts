import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import Comments from '../components/Comments.vue'
import HomeHero from '../components/HomeHero.vue'
import RecentPosts from '../components/RecentPosts.vue'
import { h } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.component('HomeHero', HomeHero)
    app.component('RecentPosts', RecentPosts)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Comments),
    })
  }
}
