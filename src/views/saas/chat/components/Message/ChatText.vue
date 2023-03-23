<script setup>
import { computed, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import mdKatex from '@traptitech/markdown-it-katex';
import hljs from 'highlight.js';
import { useBasicLayout } from '@/hooks/useBasicLayout';

const props = defineProps({
  text: String,
  inversion: Boolean,
  error: Boolean,
  loading: Boolean,
});

const { isMobile } = useBasicLayout();

const textRef = ref();

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

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    isMobile.value ? 'p-2' : 'p-3',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    { 'text-red-500': props.error },
  ];
});

const text = computed(() => {
  const value = props.text ?? '';
  if (!props.inversion) return mdi.render(value);
  return value;
});

function highlightBlock(str, lang) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`;
}

defineExpose({ textRef });
</script>

<template>
  <div class="" :class="wrapClass">
    <template v-if="loading">
      <span class="w-[4px] h-[20px] block animate-blink" />
    </template>
    <template v-else>
      <div ref="textRef" class="leading-relaxed break-words">
        <div v-if="!inversion" class="markdown-body" v-html="text" />
        <div v-else class="whitespace-pre-wrap" v-text="text" />
      </div>
    </template>
  </div>
</template>

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
