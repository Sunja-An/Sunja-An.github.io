import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Sunja-An Blog",
  description: "Welcome to my blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Posts', link: '/posts/' },
      { text: 'About', link: '/about' }
    ],

    sidebar: [
      {
        text: 'Posts',
        items: [
           // This will be populated or handled differently if we want auto-generation,
           // for now let's just link to the main pages or key posts.
           // We might want to use a custom theme layout for blog posts later.
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Sunja-An' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Sunja An'
    }
  },
  srcExclude: ['hugo_backup/**']
})
