# Concert Image Overlay Design

## Goal

Give homepage visitors an immediate, date-specific way to notice the 16 August 2026 concert and open the supplied event image without leaving the page.

## Approved Design

Add a gold-outlined button labelled **“16 August · Concert”** to the homepage hero, below the existing subtitle. The label remains accurate before and after the event and fits the site's piano-inspired black, ivory, and gold visual language.

Activating the button opens `/Users/yuqiaochen/Downloads/14823.PNG` as a centered image above the homepage. A dark translucent backdrop lightly blurs the page so attention stays on the image. The image uses its natural portrait proportions and scales with `object-fit: contain`, never cropping its content.

The overlay includes a clearly visible close button. Visitors may also close it by selecting the backdrop or pressing Escape. Opening the overlay pauses background scrolling; closing it restores the prior scroll state and returns keyboard focus to the trigger.

## Responsive Behavior

The overlay fills the available viewport while respecting mobile safe-area insets. The image is limited by both viewport width and viewport height, leaving room for the close control. Narrow phones receive compact outer spacing, while tablets and desktop screens receive a larger visual margin. The design must not create horizontal page overflow at widths from 320px upward.

## Accessibility and Motion

The trigger is a native button. The overlay uses dialog semantics, an accessible label, keyboard focus management, and a visible focus treatment. Decorative transitions are brief and disabled when the visitor prefers reduced motion.

## Assets and Scope

Copy the supplied image into a dedicated site asset path with a descriptive filename. Only the homepage receives this concert trigger and overlay. Existing navigation, chatbot behavior, profile sections, and upcoming-event copy remain unchanged.

## Verification

Add automated checks for the trigger label, dialog semantics, local image reference, close controls, and responsive CSS safeguards. Run the complete test and site-check suites. In a real browser, verify opening, backdrop blur, closing by all supported methods, focus return, scroll locking, uncropped image presentation, and absence of overflow at 320px, 390px, 768px, and desktop widths.
