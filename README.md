# Quiz Landing Renderer

Custom WeWeb Vue component for rendering the Hammerjobs quiz landing page from one quiz object.

## Main binding

Bind `quiz` to the quiz record from Xano. The component reads:

- `quiz_order`
- `title`
- `positionName`
- `location_display`
- `main_benefit`
- `benefits`
- `tasks`
- `company_presentation`
- `positionInfos.top_benefits`
- `images`
- `images_optimized`
- `video_link`
- `colour`

## Image mapping

The component prefers `images_optimized` and falls back to the existing `images` array:

- `teamphoto`: `images[2]`
- `image_benefit`: `images[3]`
- `image_presentation`: `images[4]`
- `image_task`: `images[5]`
- `image_contactperson`: `images[6]`, currently not rendered by this component

Empty image slots are not rendered.

Logo and contact intro should be built with normal WeWeb containers outside this component.

## Events

- `action`: fired by CTA buttons. `event.action` is `start`, `benefits`, `presentation`, `tasks`, or `video`.
- `image-load`
- `image-error`

## Headline logic

The first headline uses `headline` override first. If that is empty, it uses `quiz.title`.
If there is no quiz title and `quiz.options.azubi` is true, it renders `Du hast Lust {positionName} zu werden?`.
Otherwise it renders `Neugierig, warum sich ein Wechsel als {positionName} lohnt?`.

## Performance notes

- Only visible `quiz_order` items are rendered.
- The team photo is loaded with `loading="eager"` and `fetchpriority="high"`.
- YouTube is only embedded after the video preview is clicked.
