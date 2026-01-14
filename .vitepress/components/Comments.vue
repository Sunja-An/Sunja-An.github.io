<script setup>
import Giscus from '@giscus/vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div v-if="frontmatter.comments !== false" class="comments-container">
    <Giscus
      id="comments"
      repo="Sunja-An/Sunja-An.github.io"
      repoId="[YOUR_REPO_ID]"
      category="[YOUR_CATEGORY_NAME]"
      categoryId="[YOUR_CATEGORY_ID]"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="en"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.comments-container {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
