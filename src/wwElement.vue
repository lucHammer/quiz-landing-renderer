<template>
  <main class="quiz-landing" :style="rootStyle">
    <template v-for="item in visibleItems" :key="item.key">
      <section v-if="item.type === 'title'" class="quiz-block quiz-block--title">
        <p v-if="eyebrow" class="quiz-block__eyebrow">{{ eyebrow }}</p>
        <h1 class="quiz-block__headline">{{ headline }}</h1>
      </section>

      <section v-else-if="item.type === 'buttons'" class="quiz-block quiz-block--cta">
        <div v-if="buttonLeftSrc || buttonRightSrc" class="quiz-block__button-images">
          <img
            v-if="buttonLeftSrc"
            class="quiz-block__button-image"
            :src="buttonLeftSrc"
            alt=""
            loading="lazy"
            decoding="async"
          >
          <img
            v-if="buttonRightSrc"
            class="quiz-block__button-image"
            :src="buttonRightSrc"
            alt=""
            loading="lazy"
            decoding="async"
          >
        </div>
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
        <button
          v-if="!videoLoaded"
          class="quiz-video"
          type="button"
          :style="videoPosterStyle"
          @click="loadVideo"
        >
          <span class="quiz-video__play" aria-hidden="true">▶</span>
          <span class="quiz-video__label">{{ videoButtonLabel }}</span>
        </button>
        <iframe
          v-else
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
            <span>{{ entry.text }}</span>
          </li>
        </ul>
        <button class="quiz-landing__button quiz-landing__button--secondary" type="button" @click="emitAction('benefits')">
          {{ benefitsButtonLabel }}
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
        <h2 class="quiz-block__section-title">{{ presentationTitle }}</h2>
        <p class="quiz-block__section-subtitle">{{ presentationSubtitle }}</p>
        <div v-if="presentationItems.length" class="quiz-rich-list">
          <article v-for="entry in presentationItems" :key="entry.text" class="quiz-rich-list__item">
            <span class="quiz-list__emoji" aria-hidden="true">{{ entry.emoji }}</span>
            <div v-html="entry.html"></div>
          </article>
        </div>
        <button class="quiz-landing__button quiz-landing__button--secondary" type="button" @click="emitAction('presentation')">
          {{ presentationButtonLabel }}
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
            <span>{{ entry.text }}</span>
          </li>
        </ul>
        <button class="quiz-landing__button quiz-landing__button--secondary" type="button" @click="emitAction('tasks')">
          {{ tasksButtonLabel }}
        </button>
      </section>
    </template>

    <footer v-if="showFooter" class="quiz-landing__footer">
      <a v-if="imprintUrl" :href="imprintUrl" @click="emitLink('imprint')">Impressum</a>
      <a v-if="privacyUrl" :href="privacyUrl" @click="emitLink('privacy')">Datenschutzerklärung</a>
    </footer>
  </main>
</template>

<script>
import { computed, ref } from 'vue';

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
  button_left: 0,
  button_right: 1,
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
    const videoLoaded = ref(false);
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
    const headline = computed(() => text(content.value.headline) || `Neugierig, warum sich ein Wechsel als ${text(quiz.value.positionName) || 'dieser Job'} lohnt?`);
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

    const buttonLeftSrc = computed(() => imageByKey('button_left'));
    const buttonRightSrc = computed(() => imageByKey('button_right'));
    const teamphotoSrc = computed(() => imageByKey('teamphoto'));
    const presentationImageSrc = computed(() => imageByKey('image_presentation'));
    const tasksImageSrc = computed(() => imageByKey('image_task'));

    const videoEmbedUrl = computed(() => youtubeEmbedUrl(quiz.value.video_link || content.value.videoUrl));
    const videoPosterStyle = computed(() => ({
      '--quiz-video-poster': teamphotoSrc.value ? `url("${teamphotoSrc.value}")` : 'none'
    }));

    const rootStyle = computed(() => ({
      '--quiz-primary': content.value.primaryColor || quiz.value.colour || '#034689',
      '--quiz-background': content.value.backgroundColor || '#ffffff',
      '--quiz-text': content.value.textColor || '#050505',
      '--quiz-muted': content.value.mutedColor || '#667085',
      '--quiz-border': content.value.borderColor || '#d8e0ea',
      '--quiz-max-width': `${numberOrFallback(content.value.maxWidth, 860)}px`,
      '--quiz-radius': `${numberOrFallback(content.value.borderRadius, 8)}px`,
      '--quiz-font': content.value.fontFamily || 'Inter, system-ui, sans-serif'
    }));

    const showFooter = computed(() => content.value.showFooter !== false);

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

    function emitLink(link) {
      emit('trigger-event', {
        name: 'link',
        event: {
          link,
          quizId: quiz.value.id || null
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

    function loadVideo() {
      videoLoaded.value = true;
      emitAction('video');
    }

    return {
      benefits,
      benefitsButtonLabel: computed(() => text(content.value.benefitsButtonLabel) || 'Ja, die Vorteile will ich!'),
      benefitsSubtitle: computed(() => text(content.value.benefitsSubtitle) || 'Erhalten Sie Vorteile, die Sie verdienen:'),
      benefitsTitle: computed(() => text(content.value.benefitsTitle) || 'Top-Arbeitsbedingungen? Bei uns garantiert!'),
      buttonLeftSrc,
      buttonRightSrc,
      companyName,
      emitAction,
      emitImageError,
      emitImageLoad,
      emitLink,
      eyebrow,
      headline,
      imprintUrl: computed(() => text(content.value.imprintUrl)),
      loadVideo,
      locationDisplay,
      mainBenefit,
      mainBenefitHtml,
      presentationButtonLabel: computed(() => text(content.value.presentationButtonLabel) || 'Klingt gut! 👍🏼'),
      presentationImageSrc,
      presentationItems,
      presentationSubtitle: computed(() => text(content.value.presentationSubtitle) || `Hi, wir sind ${companyName.value}!`),
      presentationTitle: computed(() => text(content.value.presentationTitle) || 'Passen wir zusammen?'),
      privacyUrl: computed(() => text(content.value.privacyUrl)),
      rootStyle,
      showFooter,
      startButtonLabel: computed(() => text(content.value.startButtonLabel) || 'Jetzt bewerben'),
      startButtonSubline: computed(() => text(content.value.startButtonSubline) || 'in 30 Sek. ohne Lebenslauf & Anschreiben'),
      tasks,
      tasksButtonLabel: computed(() => text(content.value.tasksButtonLabel) || 'Die Aufgaben finde ich gut!'),
      tasksImageSrc,
      tasksSubtitle: computed(() => text(content.value.tasksSubtitle) || 'Ihr spannender Alltag beinhaltet:'),
      tasksTitle: computed(() => text(content.value.tasksTitle) || 'Langweilige Aufgaben? Nicht bei uns!'),
      teamphotoAlt: computed(() => text(content.value.teamphotoAlt) || companyName.value),
      teamphotoSrc,
      topBenefits,
      videoButtonLabel: computed(() => text(content.value.videoButtonLabel) || 'Video ansehen'),
      videoEmbedUrl,
      videoLoaded,
      videoPosterStyle,
      visibleItems
    };
  }
};
</script>

<style scoped>
.quiz-landing {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--quiz-max-width);
  margin: 0 auto;
  padding: 18px 16px 32px;
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
  margin-top: 24px;
}

.quiz-block--title {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
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
  font-size: 26px;
  font-weight: 700;
  line-height: 1.14;
}

.quiz-block--cta {
  display: grid;
  justify-items: center;
  gap: 16px;
  margin-top: 48px;
}

.quiz-block__button-images {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: min(100%, 560px);
}

.quiz-block__button-image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--quiz-radius);
  object-fit: cover;
}

.quiz-landing__button {
  appearance: none;
  -webkit-appearance: none;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: min(100%, 315px);
  min-height: 90px;
  padding: 15px 22px;
  border: 0;
  border-radius: var(--quiz-radius);
  background: var(--quiz-primary);
  color: #ffffff;
  font: inherit;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  cursor: pointer;
  box-shadow: 0 14px 30px color-mix(in srgb, var(--quiz-primary) 18%, transparent);
}

.quiz-landing__button small {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
}

.quiz-landing__button--secondary {
  min-height: 58px;
  margin-top: 24px;
  font-size: 18px;
  font-weight: 700;
}

.quiz-block--compact {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-top: 26px;
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
  margin-top: 30px;
}

.quiz-block__image {
  display: block;
  width: min(100%, 550px);
  aspect-ratio: 3 / 2;
  border-radius: var(--quiz-radius);
  object-fit: cover;
}

.quiz-video,
.quiz-video__frame {
  width: min(100%, 550px);
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--quiz-radius);
  overflow: hidden;
}

.quiz-video {
  position: relative;
  display: grid;
  place-items: center;
  background-color: color-mix(in srgb, var(--quiz-primary) 78%, #111827);
  background-image: linear-gradient(rgba(3, 70, 137, 0.18), rgba(3, 70, 137, 0.18)), var(--quiz-video-poster);
  background-position: center;
  background-size: cover;
  color: #ffffff;
  cursor: pointer;
}

.quiz-video__play {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  padding-left: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 36px;
  line-height: 1;
}

.quiz-video__label {
  position: absolute;
  left: 18px;
  bottom: 16px;
  font-size: 16px;
  font-weight: 700;
}

.quiz-block--list,
.quiz-block--presentation {
  display: grid;
  justify-items: center;
}

.quiz-block__section-title {
  max-width: 560px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.08;
}

.quiz-block__section-subtitle {
  max-width: 520px;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.quiz-block--list .quiz-list {
  width: min(100%, 560px);
  margin-top: 24px;
}

.quiz-list__item,
.quiz-rich-list__item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  text-align: left;
}

.quiz-list__emoji {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  font-size: 28px;
  line-height: 1;
}

.quiz-rich-list {
  display: grid;
  gap: 16px;
  width: min(100%, 560px);
  margin-top: 24px;
}

.quiz-rich-list__item :deep(p) {
  margin: 0;
}

.quiz-landing__footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 36px;
  color: var(--quiz-muted);
  font-size: 13px;
}

.quiz-landing__footer a {
  color: inherit;
  text-decoration: none;
}

.quiz-landing__footer a:hover {
  color: var(--quiz-primary);
}

@media (max-width: 560px) {
  .quiz-landing {
    padding: 14px 12px 26px;
  }

  .quiz-block {
    margin-top: 22px;
  }

  .quiz-block__button-images {
    grid-template-columns: 1fr;
  }

  .quiz-landing__button {
    min-height: 86px;
    font-size: 20px;
  }

  .quiz-block__headline {
    font-size: 23px;
  }

  .quiz-block__main-benefit {
    font-size: 17px;
  }

  .quiz-block__section-title {
    font-size: 28px;
  }

  .quiz-block__section-subtitle {
    font-size: 16px;
  }
}
</style>
