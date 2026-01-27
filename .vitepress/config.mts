import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getSidebarItems(category?: string) {
  const postsDir = path.resolve(__dirname, '../posts')
  const items: { text: string; link: string; date: Date; categories: string[] }[] = []

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
      const categoryMatch = content.match(/categories:\s*\n\s*-\s*(.*)/)

      if (titleMatch && dateMatch) {
        items.push({
          text: titleMatch[1].trim(),
          link: link,
          date: new Date(dateMatch[1].trim()),
          categories: categoryMatch ? [categoryMatch[1].trim()] : []
        })
      }
    }
  })

  // Sort by date descending
  items.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Filter by category if provided
  if (category) {
    return items
      .filter(item => item.categories.includes(category))
      .map(item => ({
        text: item.text,
        link: item.link
      }))
  }

  // Take top 5 for default/home if needed, or just return all
  return items.map(item => ({
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
        text: 'Develop',
        collapsed: false,
        items: getSidebarItems('develop')
      },
      {
        text: 'Algorithm',
        collapsed: false,
        items: getSidebarItems('algorithm')
      },
      {
        text: 'CS',
        collapsed: false,
        items: getSidebarItems('CS')
      },
      {
        text: 'DB',
        collapsed: false,
        items: getSidebarItems('DB')
      },
      {
        text: 'Test',
        collapsed: false,
        items: getSidebarItems('test')
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
