import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSidebarItems() {
  const postsDir = path.resolve(__dirname, '../posts')
  const items: { text: string; link: string; date: Date }[] = []

  // Ensure posts directory exists
  if (!fs.existsSync(postsDir)) {
    return []
  }

  const entries = fs.readdirSync(postsDir, { withFileTypes: true })

  entries.forEach((entry) => {
    if (entry.name === 'index.md' || entry.name === 'posts.data.ts' || entry.name === '.DS_Store') return

    let filePath = ''
    let link = ''

    if (entry.isDirectory()) {
      const indexPath = path.join(postsDir, entry.name, 'index.md')
      if (fs.existsSync(indexPath)) {
        filePath = indexPath
        link = `/posts/${entry.name}/`
      }
    } else if (entry.name.endsWith('.md')) {
      filePath = path.join(postsDir, entry.name)
      link = `/posts/${entry.name.replace('.md', '')}/`
    }

    if (filePath) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const titleMatch = content.match(/title:\s*["']?(.*?)["']?$/m)
      const dateMatch = content.match(/date:\s*(.*)/)

      if (titleMatch && dateMatch) {
        items.push({
          text: titleMatch[1].trim(),
          link: link,
          date: new Date(dateMatch[1].trim())
        })
      }
    }
  })

  // Sort by date descending
  items.sort((a, b) => b.date.getTime() - a.date.getTime())

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
