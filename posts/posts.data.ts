import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
  includeSrc: false,
  render: true,
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter((page) => page.frontmatter.date)
      .sort((a, b) => {
        return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
      })
  }
})
