<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full">
          <div class="p-4 bg-gray-100/[0.5]">
            <div class="markdown-body" v-html="text" />
          </div>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { NLayout, NLayoutContent } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import MarkdownIt from 'markdown-it';
import mdKatex from '@traptitech/markdown-it-katex';
import hljs from 'highlight.js';
import helpString from '@/assets/markdown/help.md?raw';

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ['rounded-none', 'shadow-none'];
  return ['border', 'rounded-md', 'shadow-md'];
});

const text = computed(() => {
  return mdi.render(helpString);
});

function highlightBlock(str, lang) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
}

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    if (validLang) {
      const lang = language ?? '';
      return highlightBlock(hljs.highlight(lang, code, true).value, lang);
    }
    return highlightBlock(hljs.highlightAuto(code).value, '');
  },
});

mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #ED2940' });

const getContainerClass = computed(() => {
  return ['h-full'];
});
</script>

<style lang="less">
.markdown-body {
  background-color: transparent;
  font-size: 14px;

  p {
    white-space: pre-wrap;
  }

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  pre code,
  pre tt {
    line-height: 1.65;
  }

  .highlight pre,
  pre {
    background-color: #fff;
  }

  code.hljs {
    padding: 0;
  }

  .code-block {
    &-wrapper {
      position: relative;
      padding-top: 24px;
    }

    &-header {
      position: absolute;
      top: 5px;
      right: 0;
      width: 100%;
      padding: 0 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #b3b3b3;

      &__copy {
        cursor: pointer;
        margin-left: 0.5rem;
        user-select: none;
        &:hover {
          color: #65a665;
        }
      }
    }
  }
}

html.dark {
  .highlight pre,
  pre {
    background-color: #282c34;
  }
}
</style>
