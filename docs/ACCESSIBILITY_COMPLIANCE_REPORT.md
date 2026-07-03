# Accessibility Compliance Report (WCAG 2.1 AA)

AarogyaOS is designed to meet strict WCAG 2.1 Level AA accessibility standards, ensuring rural health coordinators, district medical officers, and ASHA field workers of all abilities can access the platform seamlessly.

## Implementation Details

### 1. Semantic HTML Structure
We enforce proper semantic document architecture across all dashboards and reports:
*   A single `<main id="main-content">` element is defined per view.
*   Logical header hierarchies starting with `<h1>` followed by `<h2>` and `<h3>` without skipping levels.
*   Skip-to-content helper is the first focusable child of the document layout:
    ```html
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:p-4 bg-emerald text-navy z-50">
      Skip to main content
    </a>
    ```

### 2. ARIA Implementation
Every interactive or dynamic element includes descriptive ARIA metadata:
*   **Icon-only Buttons**: `aria-label` attributes added to Close, Microphone, and Send buttons (e.g., `aria-label="Send message"`).
*   **Live Updates**: VaaniBot chat message feeds use `role="log"` and `aria-live="polite"` so new messages are immediately announced by screen readers.
*   **Expansion States**: Navigation and accordion layouts use `aria-expanded="true|false"` to reflect visibility states.
*   **Form Controls**: Text fields use explicit `<label>` attachments or `aria-label` attributes for screen readers.

### 3. Keyboard Navigation and Focus Management
*   **Sequential Tabbing**: All interface elements are sequentially reachable using standard `Tab` and `Shift+Tab`.
*   **Visible Focus Indicators**: High-contrast, tailored outline rings are applied to all focusable targets:
    ```css
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald
    ```
*   **Dialogs and Modals**: Modals trap focus locally and escape on `Escape` keypress, restoring focus to the triggering element upon close.

### 4. Color & Contrast Verification
*   All text runs meet the minimum contrast ratio of **4.5:1** against their background.
*   Large text headings (18pt+) and UI widgets meet the **3:1** ratio.
*   Color is never used as the single source of information; alert conditions are always accompanied by descriptive icons (e.g., `AlertCircle`) and text labels.

## Automated Verification

We verify accessibility compliance through two automated layers:
1.  **Component Level (Vitest + jest-axe)**: Integrated `jest-axe` checks in component unit tests to assert zero violations before code commits.
2.  **Page Level (Playwright + axe-playwright)**: Full-page scans run inside E2E pipelines to guarantee zero WCAG AA issues across the full user journey.
