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
- `company.logo` / `company.logo_optimized`
- `contact`
- `video_link`
- `colour`

## Image mapping

The component prefers `images_optimized` and falls back to the existing `images` array:

- `button_left`: `images[0]`
- `button_right`: `images[1]`
- `teamphoto`: `images[2]`
- `image_benefit`: `images[3]`
- `image_presentation`: `images[4]`
- `image_task`: `images[5]`
- `image_contactperson`: `images[6]`

Empty image slots are not rendered.

## Events

- `action`: fired by CTA buttons. `event.action` is `start`, `benefits`, `presentation`, `tasks`, or `video`.
- `link`: fired by footer links.
- `image-load`
- `image-error`

## Performance notes

- Only visible `quiz_order` items are rendered.
- The team photo is loaded with `loading="eager"` and `fetchpriority="high"`.
- YouTube is only embedded after the video preview is clicked.
