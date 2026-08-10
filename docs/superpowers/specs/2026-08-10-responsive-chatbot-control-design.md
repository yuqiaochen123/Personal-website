# Responsive Chatbot Control Design

## Goal

Keep the gold “Chat with AI” control visually separate from the piano navigation on every screen size while preserving immediate access to the chatbot.

## Approved Design

The control remains fixed at the right edge. Its vertical position is derived from the piano keyboard height rather than a collection of device-specific guesses: desktop keyboard height plus 24px, and mobile keyboard height plus 20px. Screens wider than 480px retain the text label; screens at or below 480px use the existing circular icon-only presentation. Horizontal spacing uses the browser safe-area inset so the control does not collide with notches or rounded display edges.

The shared rule lives in `chatbot-shared.css` and therefore applies consistently to every public page. The existing gold palette, typography, modal behavior, and piano navigation remain unchanged.

## Verification

An automated source test will assert the shared keyboard-height variables, safe-area offset, mobile breakpoint, and label-hiding behavior. Browser checks will cover 320px, 390px, 480px, 768px, 875px, and 1280px widths, confirming a visible gap below the keyboard, no viewport overflow, and a usable control.
