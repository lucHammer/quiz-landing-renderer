export default {
  editor: {
    label: 'Quiz Landing Renderer',
    icon: 'layout-template'
  },
  options: {
    displayAllowedValues: ['block', 'flex']
  },
  triggerEvents: [
    {
      name: 'action',
      label: { en: 'CTA/action clicked' },
      event: {
        action: '',
        quizId: null,
        quiz: {}
      }
    },
    {
      name: 'link',
      label: { en: 'Footer link clicked' },
      event: {
        link: '',
        quizId: null
      }
    },
    {
      name: 'image-load',
      label: { en: 'Image loaded' },
      event: {
        key: '',
        src: '',
        naturalWidth: 0,
        naturalHeight: 0
      }
    },
    {
      name: 'image-error',
      label: { en: 'Image failed' },
      event: {
        key: '',
        src: ''
      }
    }
  ],
  properties: {
    quiz: {
      label: { en: 'Quiz object' },
      type: 'json',
      bindable: true,
      defaultValue: {}
    },
    layoutItems: {
      label: { en: 'Layout items' },
      type: 'json',
      bindable: true,
      defaultValue: null
    },
    companyName: {
      label: { en: 'Company name override' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    headline: {
      label: { en: 'Headline override' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    eyebrow: {
      label: { en: 'Eyebrow' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    locationDisplay: {
      label: { en: 'Location override' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    topBenefits: {
      label: { en: 'Top benefits override' },
      type: 'json',
      bindable: true,
      defaultValue: null
    },
    videoUrl: {
      label: { en: 'Video URL override' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    startButtonLabel: {
      label: { en: 'Start button label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Jetzt bewerben'
    },
    startButtonSubline: {
      label: { en: 'Start button subline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'in 30 Sek. ohne Lebenslauf & Anschreiben'
    },
    benefitsTitle: {
      label: { en: 'Benefits title' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Top-Arbeitsbedingungen? Bei uns garantiert!'
    },
    benefitsSubtitle: {
      label: { en: 'Benefits subtitle' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Erhalten Sie Vorteile, die Sie verdienen:'
    },
    benefitsButtonLabel: {
      label: { en: 'Benefits button label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Passen wir zusammen?'
    },
    benefitsButtonSubline: {
      label: { en: 'Benefits button subline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Ja, die Vorteile will ich!'
    },
    presentationTitle: {
      label: { en: 'Presentation title' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Passen wir zusammen?'
    },
    presentationSubtitle: {
      label: { en: 'Presentation subtitle override' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    presentationButtonLabel: {
      label: { en: 'Presentation button label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Klingt gut! 👍🏼'
    },
    presentationButtonSubline: {
      label: { en: 'Presentation button subline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Passen wir zusammen?'
    },
    tasksTitle: {
      label: { en: 'Tasks title' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Langweilige Aufgaben? Nicht bei uns!'
    },
    tasksSubtitle: {
      label: { en: 'Tasks subtitle' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Ihr spannender Alltag beinhaltet:'
    },
    tasksButtonLabel: {
      label: { en: 'Tasks button label' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Zum nächsten Schritt!'
    },
    tasksButtonSubline: {
      label: { en: 'Tasks button subline' },
      type: 'Text',
      bindable: true,
      defaultValue: 'Die Aufgaben finde ich gut!'
    },
    teamphotoAlt: {
      label: { en: 'Team photo alt' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    imprintUrl: {
      label: { en: 'Imprint URL' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    privacyUrl: {
      label: { en: 'Privacy URL' },
      type: 'Text',
      bindable: true,
      defaultValue: ''
    },
    showFooter: {
      label: { en: 'Show footer' },
      type: 'Boolean',
      bindable: true,
      defaultValue: true
    },
    primaryColor: {
      label: { en: 'Primary color' },
      type: 'Color',
      bindable: true,
      defaultValue: '#034689'
    },
    backgroundColor: {
      label: { en: 'Background color' },
      type: 'Color',
      bindable: true,
      defaultValue: '#ffffff'
    },
    textColor: {
      label: { en: 'Text color' },
      type: 'Color',
      bindable: true,
      defaultValue: '#050505'
    },
    mutedColor: {
      label: { en: 'Muted color' },
      type: 'Color',
      bindable: true,
      defaultValue: '#667085'
    },
    borderColor: {
      label: { en: 'Border color' },
      type: 'Color',
      bindable: true,
      defaultValue: '#d8e0ea'
    },
    maxWidth: {
      label: { en: 'Max width' },
      type: 'Text',
      bindable: true,
      defaultValue: '860px'
    },
    contentWidth: {
      label: { en: 'Content width' },
      type: 'Text',
      bindable: true,
      defaultValue: '550px'
    },
    buttonWidth: {
      label: { en: 'Button width' },
      type: 'Text',
      bindable: true,
      defaultValue: '315px'
    },
    buttonHeight: {
      label: { en: 'Button height' },
      type: 'Text',
      bindable: true,
      defaultValue: '72px'
    },
    borderRadius: {
      label: { en: 'Border radius' },
      type: 'Number',
      bindable: true,
      defaultValue: 8,
      options: { min: 0, max: 32, step: 1 }
    },
    fontFamily: {
      label: { en: 'Font family' },
      type: 'FontFamily',
      bindable: true,
      defaultValue: 'Inter'
    }
  }
};
