import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSidebarItems() {
  const postsDir = path.resolve(__dirname, '../posts')
  const files = fs.readdirSync(postsDir)
  const items: { text: string; link: string; date: Date }[] = []

  files.forEach((file) => {
    if (file.endsWith('.md') && file !== 'index.md') {
      const filePath = path.join(postsDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const match = content.match(/title:\s*(.*)/)
      const dateMatch = content.match(/date:\s*(.*)/)
      
      if (match && dateMatch) {
        items.push({
          text: match[1].trim(),
          link: `/posts/${file.replace('.md', '')}/`,
          date: new Date(dateMatch[1].trim())
        })
      }
    }
  })

  // Sort by date descending
  items.sort((a, b) => b.date - a.date)

  // Take top 5
  return items.slice(0, 5).map(item => ({
    text: item.text,
    link: item.link
  }))
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
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
        items: getSidebarItems()
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
