# Dashboard Repurposing for AgentAdmissions - User Stories

## Epic: Convert Generic Dashboard to Behavioral Health CRM Dashboard

### Overview
Transform the existing generic dashboard components to align with AgentAdmissions behavioral health CRM use case through minimal code changes, focusing on text/label updates and data mapping.

---

## 🎯 Sprint 0: Codebase Familiarization & Setup (Priority: P0)

### Story 0.1: Understand Dashboard Architecture
- [x] **As an AI builder**, I want to analyze the dashboard structure and components, so that I understand the codebase before making changes.

**Acceptance Criteria:**
- Given the dashboard codebase, when I analyze the structure, then I should:
  - Read and document the contents of `src/app/dashboard/overview/layout.tsx`
  - Read and document all dashboard component files in `src/features/overview/components/`
  - Identify the parallel loading pattern using Next.js parallel routes
  - Document the component hierarchy and data flow
  - Note any existing UI component libraries (shadcn/ui, Radix UI)

**Files to Read:**
- `src/app/dashboard/overview/layout.tsx`
- `src/features/overview/components/area-graph.tsx`
- `src/features/overview/components/bar-graph.tsx`
- `src/features/overview/components/pie-graph.tsx`  
- `src/features/overview/components/recent-sales.tsx`
- `src/features/overview/components/revenue-pipeline.tsx` (DO NOT MODIFY - for reference only)

### Story 0.2: Document Component Dependencies
- [x] **As an AI builder**, I want to understand the UI components and utilities used, so that I can maintain consistency.

**Acceptance Criteria:**
- Given the component files, when I analyze imports, then I should document:
  - Chart library usage (recharts)
  - UI component usage from `@/components/ui/`
  - Any custom hooks or utilities
  - Color schemes and theming approach
  - Responsive design patterns (@container queries)

---

## 📊 Sprint 1: Pie Graph Conversion (Priority: P1 - Simplest)

### Story 1.1: Convert Pie Graph Labels to Referral Sources
- [x] **As a practice manager**, I want to see patient referral sources instead of browser statistics, so that I can understand where inquiries come from. <!-- Completed: 6/4/2025, 10:20 PM -->

**Acceptance Criteria:**
- Given the pie graph component, when I update the labels, then:
  - Title changes from "Pie Chart - Donut with Text" to "Referral Sources Distribution"
  - Description updates to "Patient inquiry sources for the last 6 months"
  - Browser labels (chrome, safari, etc.) change to referral sources
  - Center text changes from "Total Visitors" to "Total Inquiries"
  - Footer updates to show top referral source percentage

**Technical Notes:**
- File: `src/features/overview/components/pie-graph.tsx`
- Update `chartConfig` object labels
- Update `chartData` browser property names to match referral sources
- Maintain existing color gradients and animations

### Story 1.2: Update Pie Graph Data Mapping
- [x] **As an AI builder**, I want to map the mock data correctly, so that the chart displays meaningful referral source data. <!-- Completed: 6/4/2025, 10:20 PM -->

**Acceptance Criteria:**
- Given the updated labels, when the chart renders, then:
  - `chrome` → `provider_referral` with label "Provider Referral"
  - `safari` → `insurance` with label "Insurance"
  - `firefox` → `online_search` with label "Online Search"
  - `edge` → `social_media` with label "Social Media"
  - `other` remains `other` with label "Other"
  - All percentage calculations remain functional

### Story 1.3: Human Review - Pie Graph UI
- [x] **As a product manager**, I want to review the updated pie graph UI, so that I can ensure it meets our behavioral health context needs. <!-- Human approved: 6/4/2025, 10:29 PM -->

**Acceptance Criteria:**
- Given the updated pie graph, when displayed in the dashboard:
  - STOP and prompt human: "Please review the Referral Sources pie chart. Does it clearly show the distribution of patient inquiry sources? Provide feedback on any label or color adjustments needed."
  - Document any requested changes
  - Only proceed after human approval

**AI Builder Instructions:**
- After completing stories 1.1 and 1.2, use browser_action tool to:
  1. Run the development server
  2. Navigate to the dashboard
  3. Take a screenshot of the pie graph
  4. Ask for human feedback before proceeding

---

## 📈 Sprint 2: Area Graph Conversion (Priority: P1)

### Story 2.1: Convert Area Graph to Intake Trends
- [x] **As a practice manager**, I want to see intake conversion trends instead of visitor metrics, so that I can track patient acquisition effectiveness. <!-- Completed: 6/4/2025, 10:29 PM -->

**Acceptance Criteria:**
- Given the area graph component, when I update the labels, then:
  - Title changes from "Area Chart - Stacked" to "Intake Conversion Trends"
  - Description updates to "New inquiries vs converted patients over the last 6 months"
  - `visitors` label changes to `intakes`
  - `desktop` label changes to "New Inquiries"
  - `mobile` label changes to "Converted Patients"

**Technical Notes:**
- File: `src/features/overview/components/area-graph.tsx`
- Update `chartConfig` object
- Keep existing gradient fills and stacking behavior

### Story 2.2: Update Area Graph Footer Metrics
- [x] **As a practice manager**, I want to see conversion rate metrics, so that I can track improvement over time. <!-- Completed: 6/4/2025, 10:29 PM -->

**Acceptance Criteria:**
- Given the area graph footer, when I update the text, then:
  - Change "Trending up by 5.2% this month" to "Conversion rate: 24.5% this month"
  - Keep the trending icon and date range display
  - Maintain the same layout and styling

### Story 2.3: Mark Sprint 1 & 2 Progress
- [x] **As an AI builder**, I want to update the progress tracking, so that completed work is documented. <!-- Completed: 6/4/2025, 10:29 PM -->

**Acceptance Criteria:**
- Given this markdown file, when stories are completed:
  - Mark all completed story checkboxes with [x]
  - Add a completion timestamp comment next to each
  - Commit the updated markdown file

---

## 📊 Sprint 3: Bar Graph Conversion (Priority: P2)

### Story 3.1: Convert Bar Graph to Daily Intake Activity
- [x] **As a practice manager**, I want to see daily intake metrics instead of page views, so that I can track operational patterns. <!-- Completed: 6/4/2025, 10:30 PM -->

**Acceptance Criteria:**
- Given the bar graph component, when I update the labels, then:
  - Title changes from "Bar Chart - Interactive" to "Intake Activity - Daily Overview"
  - Description updates to "Daily intake metrics for the last 3 months"
  - `views` config label changes to "Intake Activity"
  - Chart maintains 3-month data range

**Technical Notes:**
- File: `src/features/overview/components/bar-graph.tsx`
- Update `chartConfig` object
- Keep interactive toggle functionality

### Story 3.2: Update Bar Graph Toggle Options
- [x] **As a practice manager**, I want to toggle between different intake metrics, so that I can analyze various aspects of the intake process. <!-- Completed: 6/4/2025, 10:30 PM -->

**Acceptance Criteria:**
- Given the toggle buttons, when I update the labels, then:
  - `desktop` button shows "New Inquiries"
  - `mobile` button shows "Assessments Scheduled"
  - `error` button shows "Charts Created" (repurpose existing button)
  - All toggle interactions remain functional
  - Tooltip shows "activity" instead of "views"

### Story 3.3: Human Review - Interactive Elements
- [x] **As a product manager**, I want to test the bar graph interactivity, so that I can ensure the toggle behavior works for our use case. <!-- Human approved: 6/4/2025, 10:32 PM -->

**Acceptance Criteria:**
- Given the updated bar graph, when testing:
  - STOP and prompt human: "Please test the Intake Activity bar chart. Click through all three toggle options (New Inquiries, Assessments Scheduled, Charts Created). Does the data display correctly for each option?"
  - Verify smooth transitions between views
  - Document any UI/UX issues

---

## 💰 Sprint 4: Recent Sales Conversion (Priority: P2)

### Story 4.1: Convert Recent Sales to Intake Activities
- [x] **As a practice manager**, I want to see recent patient intake activities instead of sales, so that I can track patient progress through our intake funnel. <!-- Completed: 6/4/2025, 10:33 PM -->

**Acceptance Criteria:**
- Given the recent sales component, when I update the content, then:
  - Title changes from "Recent Sales" to "Recent Intake Activities"
  - Description changes from "You made 265 sales this month" to "15 new patient intakes this week"
  - Component maintains avatar/name/email structure

**Technical Notes:**
- File: `src/features/overview/components/recent-sales.tsx`
- Update card header text
- Keep existing layout and avatar display

### Story 4.2: Replace Amount with Status Display
- [x] **As an AI builder**, I want to display intake status instead of dollar amounts, so that the component shows relevant patient information. <!-- Completed: 6/4/2025, 10:33 PM -->

**Acceptance Criteria:**
- Given the sales data structure, when I update the display, then:
  - Replace `amount` property with `status` in mock data
  - Status options: "Forms Sent", "Insurance Verified", "Assessment Scheduled", "Chart Created", "Intake Complete"
  - Display status as styled text (can use muted-foreground class for consistency)
  - Remove dollar sign formatting

**Mock Data Example:**
```javascript
// Instead of: amount: '+$1,999.00'
// Use: status: 'Forms Sent'
```

### Story 4.3: Final Human Review
- [ ] **As a product manager**, I want to review the complete dashboard transformation, so that I can approve the changes before deployment.

**Acceptance Criteria:**
- Given all updated components, when reviewing the full dashboard:
  - STOP and prompt human: "All dashboard components have been updated. Please review the complete dashboard and provide feedback on:
    1. Overall cohesiveness of the behavioral health theme
    2. Any label or text adjustments needed
    3. Color scheme appropriateness for healthcare
    4. Any missing elements for the use case"
  - Document all feedback
  - Only mark epic as complete after approval

---

## 📋 Definition of Done

Each story is considered complete when:
1. ✅ Code changes are implemented as specified
2. ✅ Component renders without errors
3. ✅ Existing functionality (animations, interactions) is preserved
4. ✅ Changes are visually verified in the browser
5. ✅ Story checkbox is marked complete in this document
6. ✅ Any human feedback has been addressed

---

## 🗺️ Roadmap & Dependencies

### Dependency Map:
```
Sprint 0 (Setup) → Sprint 1 (Pie) → Sprint 2 (Area) → Sprint 3 (Bar) → Sprint 4 (Sales)
                          ↓                ↓                ↓                ↓
                    Human Review      Mark Progress    Human Review    Final Review
```

### Time Estimates:
- Sprint 0: 0.5 day (reading/documentation)
- Sprint 1: 0.5 day (simplest component)
- Sprint 2: 0.5 day (simple labels)
- Sprint 3: 0.5 day (interactive elements)
- Sprint 4: 1 day (most visual changes + final review)
- **Total: ~3 days**

---

## 🎯 Prioritization (RICE Framework)

| Component | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|-----------|-------|--------|------------|--------|------------|----------|
| Pie Graph | High | Medium | High | Low | 37.5 | P1 |
| Area Graph | High | Medium | High | Low | 37.5 | P1 |
| Bar Graph | High | High | Medium | Medium | 30 | P2 |
| Recent Sales | Medium | High | Medium | High | 15 | P2 |

---

## 🤖 AI Builder Guidelines

### Before Starting:
1. Read ALL files listed in Story 0.1 and 0.2
2. Run the development server and view the current dashboard
3. Take screenshots of each component before changes
4. Understand the parallel route loading pattern

### During Implementation:
1. Work on one story at a time
2. Test each change in the browser immediately
3. Preserve all existing functionality
4. Use existing UI components and styles
5. Update this document's checkboxes after each story

### Quality Checks:
1. No console errors after changes
2. Responsive design still works
3. Animations and transitions preserved
4. Color consistency maintained
5. Accessibility features intact

### Human Interaction Points:
1. After Sprint 1 (Pie Graph) - UI Review
2. After Sprint 3 (Bar Graph) - Interaction Review  
3. After Sprint 4 (All Components) - Final Review

---

## 📝 Notes

- Revenue Pipeline component is EXCLUDED from changes (already perfect)
- All changes are text/label focused with minimal code impact
- Mock data structure remains the same (just different mental mapping)
- Focus on maintaining existing UX patterns while adapting content

---

*Last Updated: 6/4/2025, 10:34 PM*
*Progress: 13/15 stories completed*
