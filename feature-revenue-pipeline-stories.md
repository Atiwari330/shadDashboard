# Revenue Pipeline Feature - User Stories

## Epic: Behavioral Health CRM Revenue Pipeline Dashboard

### Overview
This document contains a prioritized list of user stories for implementing a Revenue Pipeline visualization for a behavioral health service provider CRM. The pipeline tracks leads through four stages: Lead Generated → Insurance Verified → Intake Scheduled → Admitted.

### Target Users
- **Primary**: Decision makers at behavioral health organizations (C-suite, Directors)
- **Secondary**: Revenue cycle managers, intake coordinators

---

## 🏗️ Foundation & Context (Priority: P0 - Must Complete First)

### STORY-001: Codebase Familiarization
- [x] **As an AI builder**, I want to understand the existing dashboard architecture, so that I can integrate the new pipeline component seamlessly.

**Acceptance Criteria:**
- [x] Given the codebase, when I analyze the structure, then I document:
  - Dashboard layout system in `src/app/dashboard/overview/layout.tsx`
  - Existing chart components in `src/features/overview/components/`
  - UI component library in `src/components/ui/`
  - Card component structure and styling patterns
  - Color theme variables in `src/app/globals.css` and `src/app/theme.css`
- [x] Given the analysis, when complete, then create a comment summary of reusable components

**Files to Read:**
1. `src/app/dashboard/overview/layout.tsx` - Dashboard structure
2. `src/features/overview/components/bar-graph.tsx` - Chart component pattern
3. `src/components/ui/card.tsx` - Card component
4. `src/components/ui/badge.tsx` - Badge component
5. `src/components/ui/dialog.tsx` - Dialog component
6. `src/app/globals.css` - Global styles
7. `package.json` - Dependencies (check for animation libraries)

---

## 📊 Core Pipeline Component (Priority: P0)

### STORY-002: Create Pipeline Data Structure
- [x] **As a developer**, I want to define the mock data structure for the revenue pipeline, so that I have realistic demo data.

**Acceptance Criteria:**
- [x] Given the pipeline requirements, when I create the data structure, then it includes:
  - Four stages with names, values, counts
  - Conversion rates between stages
  - Breakdown data by insurance type, service type, and referral source
  - Stuck and at-risk lead counts
- [x] Given the structure, when implemented, then it's typed with TypeScript interfaces

**Implementation Notes:**
- Create in `src/features/overview/types/pipeline.types.ts`
- Include helper functions to generate realistic variations

### STORY-003: Build Basic Pipeline Component
- [x] **As a decision maker**, I want to see a horizontal pipeline visualization, so that I can understand revenue flow at a glance.

**Acceptance Criteria:**
- [x] Given the pipeline component, when rendered, then it displays:
  - Four connected stage boxes in a horizontal layout
  - Dollar values and lead counts for each stage
  - Visual connectors between stages
- [x] Given the component, when viewed on different screens, then it's responsive
- [x] Given the existing design, when styled, then it matches the current dashboard theme

**Dependencies:** STORY-002

**Implementation Notes:**
- Create `src/features/overview/components/revenue-pipeline.tsx`
- Use existing Card components from `src/components/ui/card.tsx`
- Follow the pattern from `bar-graph.tsx` for component structure

### STORY-004: Add Conversion Rate Indicators
- [x] **As a revenue manager**, I want to see conversion rates between stages, so that I can identify bottlenecks.

**Acceptance Criteria:**
- [x] Given the pipeline, when displayed, then show percentage between each stage
- [x] Given low conversion rates (<50%), when displayed, then highlight in warning color
- [x] Given the indicators, when hovered, then show tooltip with exact percentage

**Dependencies:** STORY-003

**🛑 CHECKPOINT-001: Basic Pipeline UI Review**
- [x] Stop development and prompt human tester
- [x] Display the basic pipeline with conversion rates
- [ ] Gather feedback on layout, readability, and visual hierarchy
- [ ] Document any requested adjustments before proceeding

---

## 🎯 Interactive Features (Priority: P1)

### STORY-005: Implement Stage Click Interactions
- [x] **As a decision maker**, I want to click on pipeline stages, so that I can see detailed breakdowns.

**Acceptance Criteria:**
- [x] Given a stage box, when clicked, then open a dialog/sheet
- [x] Given the dialog, when opened, then display:
  - Pie chart for insurance type breakdown
  - Bar chart for service type distribution
  - List of top referral sources
- [x] Given the dialog, when open, then include a close button

**Dependencies:** STORY-003

**Implementation Notes:**
- Use existing Dialog component from `src/components/ui/dialog.tsx`
- Reuse chart components where possible
- Follow existing modal patterns in the codebase

### STORY-006: Add Status Indicators
- [x] **As an intake coordinator**, I want to see which leads are stuck or at risk, so that I can prioritize follow-ups.

**Acceptance Criteria:**
- [x] Given stuck leads (>48 hours idle), when displayed, then show clock badge
- [x] Given at-risk high-value leads, when displayed, then show warning badge
- [x] Given the badges, when clicked, then show list of affected leads
- [x] Given the indicators, when present, then animate subtly to draw attention

**Dependencies:** STORY-003

**Implementation Notes:**
- Use Badge component from `src/components/ui/badge.tsx`
- Add subtle pulse animation for at-risk indicators

### STORY-007: Create Hover Effects
- [x] **As a user**, I want to see additional information on hover, so that I can get quick insights without clicking.

**Acceptance Criteria:**
- [x] Given a stage box, when hovered, then highlight with subtle elevation
- [x] Given conversion indicators, when hovered, then show detailed tooltip
- [x] Given status badges, when hovered, then show count and definition

**Dependencies:** STORY-004, STORY-006

**🛑 CHECKPOINT-002: Interactive Features Review**
- [x] Stop development and prompt human tester
- [x] Demonstrate all click and hover interactions
- [x] Test dialog opening/closing functionality
- [ ] Gather feedback on interaction patterns and information hierarchy
- [ ] Document any UX improvements needed

---

## ✨ Visual Enhancements (Priority: P2)

### STORY-008: Add Flow Animation
- [x] **As a user**, I want to see visual flow between stages, so that I understand the pipeline is dynamic.

**Acceptance Criteria:**
- [x] Given the pipeline, when loaded, then show subtle animated particles/dots flowing between stages
- [x] Given the animation, when running, then it should be subtle and not distracting
- [x] Given user preferences, when reduced motion is enabled, then disable animations

**Dependencies:** STORY-003

**Implementation Notes:**
- Use CSS animations or Framer Motion if already in project
- Keep animations lightweight for performance

### STORY-009: Implement Responsive Design
- [x] **As a mobile user**, I want to view the pipeline on smaller screens, so that I can check metrics on the go.

**Acceptance Criteria:**
- [x] Given a mobile viewport, when displayed, then stack stages vertically
- [x] Given a tablet viewport, when displayed, then show 2x2 grid
- [x] Given any viewport, when resized, then maintain readability

**Dependencies:** STORY-003

---

## 🔄 Integration (Priority: P1)

### STORY-010: Integrate into Dashboard Layout
- [x] **As a user**, I want the pipeline in my main dashboard, so that it's part of my regular workflow.

**Acceptance Criteria:**
- [x] Given the dashboard layout, when modified, then pipeline replaces or complements existing chart
- [x] Given the integration, when complete, then maintains existing dashboard functionality
- [x] Given the layout, when rendered, then pipeline has appropriate spacing and alignment

**Dependencies:** STORY-003

**Implementation Notes:**
- Modify `src/app/dashboard/overview/layout.tsx`
- Create new parallel route if needed: `src/app/dashboard/overview/@pipeline/page.tsx`

### STORY-011: Add Loading States
- [x] **As a user**, I want to see loading indicators, so that I know data is being fetched.

**Acceptance Criteria:**
- [x] Given initial load, when fetching, then show skeleton loader
- [x] Given the skeleton, when displayed, then match pipeline layout
- [x] Given data loaded, when complete, then smoothly transition to actual content

**Dependencies:** STORY-010

**🛑 CHECKPOINT-003: Full Integration Review**
- [ ] Stop development and prompt human tester
- [ ] Review complete pipeline in dashboard context
- [ ] Test all features with mock data variations
- [ ] Verify responsive behavior across devices
- [ ] Document final adjustments needed

---

## 📋 Polish & Documentation (Priority: P3)

### STORY-012: Add Error Handling
- [ ] **As a developer**, I want proper error boundaries, so that pipeline errors don't crash the dashboard.

**Acceptance Criteria:**
- [ ] Given a component error, when caught, then display fallback UI
- [ ] Given missing data, when detected, then show appropriate empty state
- [ ] Given the errors, when logged, then include helpful debugging info

### STORY-013: Create Component Documentation
- [ ] **As a future developer**, I want documentation, so that I can maintain and extend the pipeline.

**Acceptance Criteria:**
- [ ] Given the component, when documented, then include:
  - Props interface with descriptions
  - Usage examples
  - Mock data structure explanation
- [ ] Given the documentation, when complete, then follows project standards

### STORY-014: Performance Optimization
- [ ] **As a user**, I want fast load times, so that I can quickly access my metrics.

**Acceptance Criteria:**
- [ ] Given the component, when profiled, then renders in <100ms
- [ ] Given animations, when running, then maintain 60fps
- [ ] Given the bundle, when built, then component adds <50KB

**🛑 FINAL CHECKPOINT: Complete Feature Review**
- [ ] Stop development and prompt human tester
- [ ] Demonstrate complete feature with all enhancements
- [ ] Run through different data scenarios
- [ ] Verify all acceptance criteria are met
- [ ] Get final sign-off before marking epic complete

---

## 📅 Sprint Planning

### Sprint 1 (Days 1-2): Foundation
- STORY-001: Codebase Familiarization
- STORY-002: Create Pipeline Data Structure
- STORY-003: Build Basic Pipeline Component
- STORY-004: Add Conversion Rate Indicators
- CHECKPOINT-001

### Sprint 2 (Days 3-4): Interactivity
- STORY-005: Implement Stage Click Interactions
- STORY-006: Add Status Indicators
- STORY-007: Create Hover Effects
- CHECKPOINT-002

### Sprint 3 (Days 5-6): Integration & Polish
- STORY-008: Add Flow Animation
- STORY-009: Implement Responsive Design
- STORY-010: Integrate into Dashboard Layout
- STORY-011: Add Loading States
- CHECKPOINT-003

### Sprint 4 (Day 7): Final Polish
- STORY-012: Add Error Handling
- STORY-013: Create Component Documentation
- STORY-014: Performance Optimization
- FINAL CHECKPOINT

---

## 🎯 Prioritization Matrix (RICE Score)

| Story | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|-------|-------|--------|------------|--------|------------|----------|
| 001-004 | 100% | High | High | Low | 300 | P0 |
| 005-007 | 80% | High | High | Medium | 160 | P1 |
| 010-011 | 100% | High | High | Low | 300 | P1 |
| 008-009 | 60% | Medium | Medium | Medium | 45 | P2 |
| 012-014 | 40% | Medium | High | Low | 80 | P3 |

---

## ✅ Definition of Done

Each story is considered complete when:
1. [ ] All acceptance criteria are met
2. [ ] Code follows project conventions and patterns
3. [ ] Component is responsive and accessible
4. [ ] No console errors or warnings
5. [ ] Checkpoint feedback (if applicable) is incorporated
6. [ ] Story checkbox is marked complete in this document

---

## 🔗 Key Dependencies

- **External**: None (using mock data for demo)
- **Internal**: 
  - Existing UI component library (shadcn/ui)
  - Dashboard layout system
  - Recharts for data visualization

---

## 📝 Notes for AI Builder

1. **Start Here**: Always begin with STORY-001 to understand the codebase
2. **Reuse Components**: Prioritize existing UI components over creating new ones
3. **Follow Patterns**: Match the coding style seen in `bar-graph.tsx` and other chart components
4. **Check Progress**: After completing each story, mark its checkbox with an 'x'
5. **Request Review**: At each checkpoint, explicitly ask for human review before proceeding
6. **Mock Data**: Keep mock data realistic but varied to show different scenarios

Remember: This is a demo version. Focus on visual impact and smooth interactions rather than complex data handling.
