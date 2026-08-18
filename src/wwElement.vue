<template>
  <main class="quiz-landing" :style="rootStyle">
    <template v-for="item in visibleItems" :key="item.key">
      <section v-if="item.type === 'title'" class="quiz-block quiz-block--title">
        <p v-if="eyebrow" class="quiz-block__eyebrow">{{ eyebrow }}</p>
        <h1 class="quiz-block__headline">{{ headline }}</h1>
      </section>

      <section v-else-if="item.type === 'buttons'" class="quiz-block quiz-block--cta">
        <button class="quiz-landing__button" type="button" @click="emitAction('start')">
          <span>{{ startButtonLabel }}</span>
          <small>{{ startButtonSubline }}</small>
        </button>
      </section>

      <section v-else-if="item.type === 'location' && locationDisplay" class="quiz-block quiz-block--compact">
        <div class="quiz-block__icon" aria-hidden="true">📍</div>
        <p class="quiz-block__plain">{{ locationDisplay }}</p>
      </section>

      <section v-else-if="item.type === 'top_benefits' && topBenefits.length" class="quiz-block quiz-block--compact">
        <ul class="quiz-list quiz-list--top">
          <li v-for="benefit in topBenefits" :key="benefit">{{ benefit }}</li>
        </ul>
      </section>

      <section v-else-if="item.type === 'main_benefit' && mainBenefit" class="quiz-block quiz-block--compact">
        <div class="quiz-block__main-benefit" v-html="mainBenefitHtml"></div>
      </section>

      <section v-else-if="item.type === 'teamphoto' && teamphotoSrc" class="quiz-block quiz-block--media">
        <img
          class="quiz-block__image"
          :src="teamphotoSrc"
          :alt="teamphotoAlt"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          @load="emitImageLoad('teamphoto', $event)"
          @error="emitImageError('teamphoto')"
        >
      </section>

      <section v-else-if="item.type === 'video' && videoEmbedUrl" class="quiz-block quiz-block--media">
        <iframe
          class="quiz-video__frame"
          :src="videoEmbedUrl"
          title="Video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </section>

      <section v-else-if="item.type === 'benefits' && benefits.length" class="quiz-block quiz-block--list">
        <h2 class="quiz-block__section-title">{{ benefitsTitle }}</h2>
        <p class="quiz-block__section-subtitle">{{ benefitsSubtitle }}</p>
        <ul class="quiz-list">
          <li v-for="entry in benefits" :key="entry.text" class="quiz-list__item">
            <span class="quiz-list__emoji" aria-hidden="true">{{ entry.emoji }}</span>
            <div class="quiz-list__content" v-html="entry.html"></div>
          </li>
        </ul>
        <button
          class="quiz-landing__button quiz-landing__button--secondary quiz-landing__button--small-first"
          type="button"
          @click="emitAction('benefits')"
        >
          <small>{{ benefitsButtonSubline }}</small>
          <span>{{ benefitsButtonLabel }}</span>
        </button>
      </section>

      <section v-else-if="item.type === 'presentation'" class="quiz-block quiz-block--presentation">
        <img
          v-if="presentationImageSrc"
          class="quiz-block__image"
          :src="presentationImageSrc"
          alt=""
          loading="lazy"
          decoding="async"
          @load="emitImageLoad('presentation', $event)"
          @error="emitImageError('presentation')"
        >
        <h2 class="quiz-block__section-title">{{ presentationHeading }}</h2>
        <div v-if="presentationItems.length" class="quiz-rich-list">
          <article v-for="entry in presentationItems" :key="entry.text" class="quiz-rich-list__item">
            <span class="quiz-list__emoji" aria-hidden="true">{{ entry.emoji }}</span>
            <div class="quiz-list__content" v-html="entry.html"></div>
          </article>
        </div>
        <button class="quiz-landing__button quiz-landing__button--secondary" type="button" @click="emitAction('presentation')">
          <span>{{ presentationButtonLabel }}</span>
          <small>{{ presentationButtonSubline }}</small>
        </button>
      </section>

      <section v-else-if="item.type === 'tasks' && tasks.length" class="quiz-block quiz-block--list">
        <img
          v-if="tasksImageSrc"
          class="quiz-block__image"
          :src="tasksImageSrc"
          alt=""
          loading="lazy"
          decoding="async"
          @load="emitImageLoad('tasks', $event)"
          @error="emitImageError('tasks')"
        >
        <h2 class="quiz-block__section-title">{{ tasksTitle }}</h2>
        <p class="quiz-block__section-subtitle">{{ tasksSubtitle }}</p>
        <ul class="quiz-list">
          <li v-for="entry in tasks" :key="entry.text" class="quiz-list__item">
            <span class="quiz-list__emoji" aria-hidden="true">{{ entry.emoji }}</span>
            <div class="quiz-list__content" v-html="entry.html"></div>
          </li>
        </ul>
        <button
          class="quiz-landing__button quiz-landing__button--secondary quiz-landing__button--small-first"
          type="button"
          @click="emitAction('tasks')"
        >
          <small>{{ tasksButtonSubline }}</small>
          <span>{{ tasksButtonLabel }}</span>
        </button>
      </section>
    </template>
  </main>
</template>

<script>
import { computed } from 'vue';

const DEFAULT_ORDER = [
  { type: 'title', visible: true },
  { type: 'buttons', visible: true },
  { type: 'location', visible: true },
  { type: 'top_benefits', visible: true },
  { type: 'main_benefit', visible: true },
  { type: 'teamphoto', visible: true },
  { type: 'video', visible: true },
  { type: 'benefits', visible: true },
  { type: 'presentation', visible: true },
  { type: 'tasks', visible: true }
];

const IMAGE_KEYS = {
  teamphoto: 2,
  image_benefit: 3,
  image_presentation: 4,
  image_task: 5,
  image_contactperson: 6
};

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cssLength(value, fallback, unit = 'px') {
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}${unit}`;
  const clean = text(value);
  if (!clean) return fallback;
  if (/^-?\d+(\.\d+)?$/.test(clean)) return `${clean}${unit}`;
  return clean;
}

function parseMaybeJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === 'object')) return value;
  if (typeof value !== 'string' || !value.trim()) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function stripHtml(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeHtml(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

function normalizeList(value) {
  const list = parseMaybeJson(value, []);
  if (!Array.isArray(list)) return [];

  return list
    .map((entry) => {
      if (typeof entry === 'string') return { emoji: '', text: text(entry), html: text(entry) };
      const cleanText = stripHtml(entry?.text || '');
      return {
        emoji: text(entry?.emoji),
        text: cleanText,
        html: sanitizeHtml(entry?.text || cleanText)
      };
    })
    .filter((entry) => entry.text || entry.emoji);
}

function normalizeOrder(value) {
  const order = parseMaybeJson(value, DEFAULT_ORDER);
  const source = Array.isArray(order) && order.length ? order : DEFAULT_ORDER;

  return source
    .map((item, index) => ({
      type: text(item?.type),
      visible: item?.visible !== false,
      key: `${text(item?.type) || 'item'}-${index}`
    }))
    .filter((item) => item.type && item.visible);
}

function normalizeUrl(value) {
  const url = text(value);
  if (!url || url === '/' || url.endsWith('/quiz/456/') || url === 'https://app.hammerjobs.de/') return '';
  return url;
}

function youtubeEmbedUrl(url) {
  const clean = text(url);
  if (!clean) return '';

  const shortMatch = clean.match(/youtu\.be\/([^?&]+)/);
  const watchMatch = clean.match(/[?&]v=([^?&]+)/);
  const embedMatch = clean.match(/youtube\.com\/embed\/([^?&]+)/);
  const id = shortMatch?.[1] || watchMatch?.[1] || embedMatch?.[1] || '';
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` : clean;
}

export default {
  name: 'QuizLandingRenderer',
  props: {
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
    content: { type: Object, required: true }
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    const content = computed(() => props.content || {});
    const quiz = computed(() => parseMaybeJson(content.value.quiz, {}) || {});

    const visibleItems = computed(() => normalizeOrder(content.value.layoutItems || quiz.value.quiz_order));
    const images = computed(() => parseMaybeJson(quiz.value.images, []));
    const optimizedImages = computed(() => parseMaybeJson(quiz.value.images_optimized, {}) || {});

    function imageByKey(key) {
      const optimized = optimizedImages.value?.[key];
      const source = optimized?.url ? optimized : images.value?.[IMAGE_KEYS[key]];
      return normalizeUrl(source?.url || source?.src || '');
    }

    const companyName = computed(() => text(content.value.companyName) || text(quiz.value.company?.company_display_name) || text(quiz.value.company?.companyName) || 'Hammerjobs');
    const options = computed(() => parseMaybeJson(quiz.value.options, {}) || {});
    const headline = computed(() => {
      const customHeadline = text(content.value.headline);
      const quizTitle = text(quiz.value.title);
      const positionName = text(quiz.value.positionName) || 'dieser Job';

      if (customHeadline) return customHeadline;
      if (quizTitle) return quizTitle;
      if (options.value?.azubi === true) return `Du hast Lust ${positionName} zu werden?`;
      return `Neugierig, warum sich ein Wechsel als ${positionName} lohnt?`;
    });
    const eyebrow = computed(() => text(content.value.eyebrow));
    const locationDisplay = computed(() => text(content.value.locationDisplay) || text(quiz.value.location_display));
    const mainBenefit = computed(() => text(quiz.value.main_benefit));
    const mainBenefitHtml = computed(() => sanitizeHtml(mainBenefit.value).replace(/\n/g, '<br>'));

    const topBenefits = computed(() => {
      const infos = parseMaybeJson(quiz.value.positionInfos, {});
      const source = content.value.topBenefits || infos?.top_benefits || [];
      return Array.isArray(source) ? source.map(text).filter(Boolean) : [];
    });

    const benefits = computed(() => normalizeList(quiz.value.benefits));
    const tasks = computed(() => normalizeList(quiz.value.tasks));
    const presentationItems = computed(() => normalizeList(quiz.value.company_presentation));

    const teamphotoSrc = computed(() => imageByKey('teamphoto'));
    const presentationImageSrc = computed(() => imageByKey('image_presentation'));
    const tasksImageSrc = computed(() => imageByKey('image_task'));

    const videoEmbedUrl = computed(() => youtubeEmbedUrl(quiz.value.video_link || content.value.videoUrl));
    const rootStyle = computed(() => ({
      '--quiz-primary': content.value.primaryColor || quiz.value.colour || '#034689',
      '--quiz-background': content.value.backgroundColor || '#ffffff',
      '--quiz-text': content.value.textColor || '#050505',
      '--quiz-muted': content.value.mutedColor || '#667085',
      '--quiz-border': content.value.borderColor || '#d8e0ea',
      '--quiz-content-width': cssLength(content.value.contentWidth, '550px'),
      '--quiz-heading-content-width': cssLength(content.value.headingContentWidth, '430px'),
      '--quiz-button-width': cssLength(content.value.buttonWidth, '315px'),
      '--quiz-button-height': cssLength(content.value.buttonHeight, '72px'),
      '--quiz-radius': `${numberOrFallback(content.value.borderRadius, 8)}px`,
      '--quiz-font': content.value.fontFamily || 'Inter, system-ui, sans-serif',
      '--quiz-heading-font': content.value.headingFontFamily || content.value.fontFamily || 'Inter, system-ui, sans-serif',
      '--quiz-heading-size': `${numberOrFallback(content.value.headingFontSize, 26)}px`,
      '--quiz-heading-weight': numberOrFallback(content.value.headingFontWeight, 700),
      '--quiz-heading-subline-font': content.value.headingSublineFontFamily || content.value.fontFamily || 'Inter, system-ui, sans-serif',
      '--quiz-heading-subline-size': `${numberOrFallback(content.value.headingSublineFontSize, 18)}px`,
      '--quiz-heading-subline-weight': numberOrFallback(content.value.headingSublineFontWeight, 600),
      '--quiz-button-font': content.value.buttonFontFamily || content.value.fontFamily || 'Inter, system-ui, sans-serif',
      '--quiz-button-size': `${numberOrFallback(content.value.buttonFontSize, 20)}px`,
      '--quiz-button-weight': numberOrFallback(content.value.buttonFontWeight, 700),
      '--quiz-button-subline-size': `${numberOrFallback(content.value.buttonSublineFontSize, 14)}px`,
      '--quiz-button-subline-weight': numberOrFallback(content.value.buttonSublineFontWeight, 400)
    }));

    function emitAction(action) {
      emit('trigger-event', {
        name: 'action',
        event: {
          action,
          quizId: quiz.value.id || null,
          quiz: quiz.value
        }
      });
    }

    function emitImageLoad(key, event) {
      const image = event.target;
      emit('trigger-event', {
        name: 'image-load',
        event: {
          key,
          src: image.currentSrc || image.src,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        }
      });
    }

    function emitImageError(key) {
      emit('trigger-event', {
        name: 'image-error',
        event: {
          key,
          src: imageByKey(key)
        }
      });
    }

    return {
      benefits,
      benefitsButtonLabel: computed(() => text(content.value.benefitsButtonLabel) || 'Passen wir zusammen?'),
      benefitsButtonSubline: computed(() => text(content.value.benefitsButtonSubline) || 'Ja, die Vorteile will ich!'),
      benefitsSubtitle: computed(() => text(content.value.benefitsSubtitle) || 'Erhalten Sie Vorteile, die Sie verdienen:'),
      benefitsTitle: computed(() => text(content.value.benefitsTitle) || 'Top-Arbeitsbedingungen? Bei uns garantiert!'),
      companyName,
      emitAction,
      emitImageError,
      emitImageLoad,
      eyebrow,
      headline,
      locationDisplay,
      mainBenefit,
      mainBenefitHtml,
      presentationButtonLabel: computed(() => text(content.value.presentationButtonLabel) || 'Klingt gut! 👍🏼'),
      presentationButtonSubline: computed(() => text(content.value.presentationButtonSubline) || 'Passen wir zusammen?'),
      presentationImageSrc,
      presentationItems,
      presentationHeading: computed(() => {
        const configuredTitle = text(content.value.presentationTitle);
        const legacySubtitle = text(content.value.presentationSubtitle);
        if (configuredTitle && configuredTitle !== 'Passen wir zusammen?') return configuredTitle;
        if (legacySubtitle && legacySubtitle !== 'Passen wir zusammen?') return legacySubtitle;
        return `Hi, wir sind ${companyName.value}!`;
      }),
      rootStyle,
      startButtonLabel: computed(() => text(content.value.startButtonLabel) || 'Jetzt bewerben'),
      startButtonSubline: computed(() => text(content.value.startButtonSubline) || 'in 30 Sek. ohne Lebenslauf & Anschreiben'),
      tasks,
      tasksButtonLabel: computed(() => text(content.value.tasksButtonLabel) || 'Zum nächsten Schritt!'),
      tasksButtonSubline: computed(() => text(content.value.tasksButtonSubline) || 'Die Aufgaben finde ich gut!'),
      tasksImageSrc,
      tasksSubtitle: computed(() => text(content.value.tasksSubtitle) || 'Ihr spannender Alltag beinhaltet:'),
      tasksTitle: computed(() => text(content.value.tasksTitle) || 'Langweilige Aufgaben? Nicht bei uns!'),
      teamphotoAlt: computed(() => text(content.value.teamphotoAlt) || companyName.value),
      teamphotoSrc,
      topBenefits,
      videoEmbedUrl,
      visibleItems
    };
  }
};
</script>

<style scoped>
.quiz-landing {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px 42px;
  background: var(--quiz-background);
  color: var(--quiz-text);
  font-family: var(--quiz-font);
  text-align: center;
}

.quiz-landing *,
.quiz-landing *::before,
.quiz-landing *::after {
  box-sizing: border-box;
}

.quiz-block__headline,
.quiz-block__section-title,
.quiz-block__plain,
.quiz-list,
.quiz-block__section-subtitle {
  margin: 0;
  letter-spacing: 0;
}

.quiz-block {
  width: 100%;
  margin-top: 34px;
}

.quiz-block--title {
  max-width: var(--quiz-heading-content-width);
  margin-left: auto;
  margin-right: auto;
  margin-top: 0;
}

.quiz-block__eyebrow {
  margin: 0 0 8px;
  color: var(--quiz-primary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}

.quiz-block__headline {
  font-family: var(--quiz-heading-font);
  font-size: var(--quiz-heading-size);
  font-weight: var(--quiz-heading-weight);
  line-height: 1.14;
}

.quiz-block--cta {
  display: grid;
  justify-items: center;
  gap: 16px;
  margin-top: 38px;
}

.quiz-landing__button {
  appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, var(--quiz-button-width));
  min-height: var(--quiz-button-height);
  padding: 16px 28px;
  border: 0;
  border-radius: var(--quiz-radius);
  background: var(--quiz-primary);
  color: #ffffff;
  font-family: var(--quiz-button-font);
  font-size: var(--quiz-button-size);
  font-weight: var(--quiz-button-weight);
  line-height: 1.1;
  cursor: pointer;
  box-shadow: 0 14px 30px color-mix(in srgb, var(--quiz-primary) 18%, transparent);
}

.quiz-landing__button small {
  margin-top: 8px;
  font-size: var(--quiz-button-subline-size);
  font-weight: var(--quiz-button-subline-weight);
}

.quiz-landing__button--small-first {
  gap: 5px;
}

.quiz-landing__button--small-first small {
  order: 0;
  margin-top: 0;
}

.quiz-landing__button--small-first span {
  order: 1;
}

.quiz-landing__button--secondary {
  min-height: calc(var(--quiz-button-height) - 6px);
  margin-top: 34px;
  font-size: var(--quiz-button-size);
  font-weight: var(--quiz-button-weight);
}

.quiz-landing__button--secondary small {
  margin-top: 6px;
}

.quiz-block--compact {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-top: 28px;
}

.quiz-block__icon {
  font-size: 18px;
  line-height: 1;
}

.quiz-block__plain {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.35;
}

.quiz-block__main-benefit {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.quiz-block__main-benefit :deep(p) {
  margin: 0;
}

.quiz-list {
  display: grid;
  gap: 12px;
  padding: 0;
  list-style: none;
}

.quiz-list--top {
  gap: 4px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.quiz-block--media {
  display: grid;
  justify-items: center;
  margin-top: 44px;
}

.quiz-block__image {
  display: block;
  width: min(100%, var(--quiz-content-width));
  aspect-ratio: 3 / 2;
  border-radius: var(--quiz-radius);
  object-fit: cover;
}

.quiz-video__frame {
  width: min(100%, var(--quiz-content-width));
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--quiz-radius);
  overflow: hidden;
}

.quiz-block--list,
.quiz-block--presentation {
  display: grid;
  justify-items: center;
  margin-top: 58px;
}

.quiz-block__section-title {
  max-width: var(--quiz-heading-content-width);
  font-family: var(--quiz-heading-font);
  font-size: var(--quiz-heading-size);
  font-weight: var(--quiz-heading-weight);
  line-height: 1.08;
}

.quiz-block__section-subtitle {
  max-width: var(--quiz-heading-content-width);
  margin-top: 12px;
  font-family: var(--quiz-heading-subline-font);
  font-size: var(--quiz-heading-subline-size);
  font-weight: var(--quiz-heading-subline-weight);
  line-height: 1.3;
}

.quiz-block--list .quiz-list {
  width: min(100%, var(--quiz-content-width));
  margin-top: 42px;
  gap: 32px;
}

.quiz-block--presentation .quiz-block__image + .quiz-block__section-title,
.quiz-block--list .quiz-block__image + .quiz-block__section-title {
  margin-top: 34px;
}

.quiz-list__item,
.quiz-rich-list__item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  text-align: left;
}

.quiz-list__emoji {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding-top: 1px;
  font-size: 28px;
  line-height: 1;
}

.quiz-list__content {
  min-width: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.35;
}

.quiz-list__content :deep(p) {
  margin: 0;
}

.quiz-list__content :deep(p + p) {
  margin-top: 10px;
}

.quiz-list__content :deep(strong),
.quiz-list__content :deep(b) {
  font-weight: 700;
}

.quiz-list__content :deep(br + br) {
  display: none;
}

.quiz-rich-list {
  display: grid;
  gap: 34px;
  width: min(100%, var(--quiz-content-width));
  margin-top: 42px;
}

@media (max-width: 560px) {
  .quiz-landing {
    padding: 20px 12px 34px;
  }

  .quiz-block {
    margin-top: 30px;
  }

  .quiz-block--title {
    margin-top: 0;
  }

  .quiz-block--cta {
    margin-top: 36px;
  }

  .quiz-block--media {
    margin-top: 40px;
  }

  .quiz-block--list,
  .quiz-block--presentation {
    margin-top: 52px;
  }

  .quiz-landing__button {
  }

  .quiz-landing__button--secondary {
    margin-top: 32px;
  }

  .quiz-block__main-benefit {
    font-size: 17px;
  }

  .quiz-block__section-subtitle {
    font-size: 16px;
  }

  .quiz-block--list .quiz-list,
  .quiz-rich-list {
    margin-top: 36px;
  }

  .quiz-block--list .quiz-list {
    gap: 28px;
  }
}
</style>
