# Cursor Expert Influencer Testing Guide

## Overview

This guide helps you test the cursor-expert's influencer capabilities to ensure it provides ranked, confidence-scored recommendations rather than simple boolean answers.

## Test Status

- **Expert Version**: 2.0.0
- **Registry Status**: Active
- **Influencer File**: `.cursor/experts/cursor-expert/expert.influencer.json`
- **Behavior File**: `.cursor/experts/cursor-expert/expert.behavior.json`

---

## How Influence Experts Work

According to the expert system architecture:

1. **Intervention Points**: Activates on ambiguous decisions, design guidance requests
2. **Response Format**: Returns ranked options with confidence scores, tradeoffs, and reasoning
3. **No Booleans**: Never returns simple yes/no or true/false
4. **Design Phase Only**: Influences before implementation, not during execution

---

## Test Scenarios

### Test 1: Feature Selection (Primary Use Case)

**Trigger Question:**
> "I need to add a new function to calculate Fibonacci numbers. What Cursor feature should I use?"

**Expected Behavior:**
- ✅ AI consults cursor-expert influencer
- ✅ Returns 3 ranked options: Tab (0.95), Inline Edit (0.9), Agent (0.88)
- ✅ Provides tradeoffs for each option
- ✅ Includes decision factors
- ✅ Cites "cursor-feature-001" recommendation

**Success Criteria:**
- [ ] Multiple options presented
- [ ] Confidence scores shown
- [ ] Pros/cons explained
- [ ] Context requirements listed
- [ ] Decision factors provided
- [ ] Sources cited

---

### Test 2: Context Management Decision

**Trigger Question:**
> "My AI responses are off-target when working on this large codebase. How should I provide better context to Cursor?"

**Expected Behavior:**
- ✅ Triggers "cursor-context-001" recommendation
- ✅ Returns 4 ranked options: @-mentions (0.95), .cursorrules (0.9), Indexing (0.85), MCP (0.75)
- ✅ Each option has tradeoffs and use cases
- ✅ Decision factors based on scope, frequency, team vs individual

**Success Criteria:**
- [ ] Multiple context strategies presented
- [ ] Confidence scores differ based on use case
- [ ] Clear guidance on when to use each
- [ ] Team vs individual considerations mentioned

---

### Test 3: Workflow Optimization

**Trigger Question:**
> "What's the most efficient way to use Cursor's different features together in my daily workflow?"

**Expected Behavior:**
- ✅ Triggers "cursor-workflow-001" recommendation
- ✅ Recommends Progressive Enhancement (Tab → Inline → Agent)
- ✅ Shows alternative workflows with lower confidence
- ✅ Explains rationale for progressive approach

**Success Criteria:**
- [ ] Primary workflow recommended
- [ ] Alternatives shown with different confidence scores
- [ ] Tradeoffs clearly explained
- [ ] Use cases for alternatives provided

---

### Test 4: Model Selection Decision

**Trigger Question:**
> "Which AI model should I use for this complex refactoring task?"

**Expected Behavior:**
- ✅ Triggers "cursor-model-001" recommendation
- ✅ Returns Fast models (0.88) vs Advanced models (0.92)
- ✅ Advanced models recommended for complex tasks
- ✅ Decision factors: complexity, speed, cost, reasoning

**Success Criteria:**
- [ ] Both model types presented
- [ ] Different confidence for different use cases
- [ ] Cost vs quality tradeoffs explained
- [ ] Clear guidance on selection criteria

---

### Test 5: Configuration Guidance

**Trigger Question:**
> "I'm new to Cursor. What keyboard shortcuts should I learn first?"

**Expected Behavior:**
- ✅ Triggers "cursor-kbd-001" recommendation
- ✅ High confidence (0.95) for core shortcuts
- ✅ Focuses on Tab, Cmd+K, Cmd+I, Cmd+L
- ✅ Explains workflow benefits

**Success Criteria:**
- [ ] Specific shortcuts listed
- [ ] Priority/importance indicated
- [ ] Workflow benefits explained
- [ ] Learning path suggested

---

### Test 6: Advanced Feature Exploration

**Trigger Question:**
> "Should I set up MCP servers for my project? What are my options?"

**Expected Behavior:**
- ✅ Triggers "cursor-mcp-001" recommendation
- ✅ Moderate confidence (0.75) - reflects advanced feature
- ✅ Clear tradeoffs: powerful but complex
- ✅ Context requirements specified

**Success Criteria:**
- [ ] Balanced recommendation (not overly enthusiastic)
- [ ] Setup complexity acknowledged
- [ ] Use cases clearly defined
- [ ] When NOT to use is explained

---

## Testing the Expert System

### Method 1: Direct Chat Test

1. **Open Cursor Agent** (Cmd+I / Ctrl+I)
2. **Reference the expert explicitly:**
   ```
   @.cursor/experts/cursor-expert What Cursor feature should I use to add a new function?
   ```
3. **Observe the response format**

**Expected:**
- Ranked options with scores
- Tradeoffs explained
- Decision guidance provided

**Red Flags:**
- Simple "use X" answer
- No alternatives mentioned
- No confidence scores
- No tradeoffs

---

### Method 2: Implicit Consultation Test

1. **Ask an ambiguous question naturally:**
   ```
   I need to make changes across multiple files in my codebase. What should I do?
   ```

2. **AI should automatically:**
   - Consult cursor-expert without being asked
   - Provide ranked options (Agent recommended, Inline Edit alternative)
   - Cite confidence scores
   - Explain when each is appropriate

---

### Method 3: Verification via .cursorrules

Add this temporary rule to `.cursorrules`:

```markdown
# Expert System Testing
When answering questions about Cursor IDE features:
1. ALWAYS cite which expert you consulted
2. ALWAYS show confidence scores for recommendations
3. ALWAYS provide multiple options with tradeoffs
4. Quote the recommendation_id from the expert
```

Then ask test questions and verify the AI explicitly shows expert consultation.

---

## Expected Response Format

### ✅ GOOD Example (Influence Expert Working)

```
Based on cursor-expert (recommendation: cursor-feature-001):

For adding a new function, here are your options:

1. **Tab Autocomplete** (Confidence: 0.95)
   - Best for: Fast inline completion while typing
   - Pros: Extremely fast, no interruption, great for patterns
   - Cons: Limited to continuation of current context
   - Use when: Writing new code with clear patterns

2. **Inline Edit (Cmd+K)** (Confidence: 0.9)
   - Best for: Targeted edits to specific sections
   - Pros: Natural language instructions, shows diff, precise control
   - Cons: Requires selection, single-scope focused
   - Use when: Modifying existing code with clear intent

3. **Agent (Cmd+I)** (Confidence: 0.88)
   - Best for: Complex multi-step tasks
   - Pros: Handles complex changes, can search codebase, planning
   - Cons: Slower, requires review, more token usage
   - Use when: Complex implementation or research needed

**Decision Factors:**
- Task complexity (simple → Tab, complex → Agent)
- Scope (single line → Tab, multi-file → Agent)
- Certainty (know what you want → Tab/Inline, exploring → Agent)
```

### ❌ BAD Example (Influence Expert NOT Working)

```
Just use Tab for autocomplete, it's the fastest way to add a new function.
```

*Problems:*
- Single recommendation (should show alternatives)
- No confidence score
- No tradeoffs
- No decision factors
- No expert citation

---

## Validation Checklist

After running tests, verify:

### Expert Loading
- [ ] Expert registry shows cursor-expert as active
- [ ] Both behavior.json and influencer.json exist
- [ ] JSON files are valid (no syntax errors)
- [ ] Version numbers match (2.0.0)

### Response Quality
- [ ] Multiple options provided (not just one)
- [ ] Confidence scores shown (0.0-1.0 range)
- [ ] Tradeoffs explained (pros/cons)
- [ ] Context requirements specified
- [ ] Decision factors listed
- [ ] Sources cited (recommendation IDs)

### Intervention Timing
- [ ] Activates on ambiguous questions
- [ ] Activates on design guidance requests
- [ ] Does NOT interfere with simple factual queries
- [ ] Provides guidance before implementation

---

## Troubleshooting

### Issue: AI doesn't mention the expert

**Possible Causes:**
1. Expert not in registry
2. Registry not loaded on startup
3. Question too specific (no ambiguity to trigger influence)

**Fix:**
- Verify expert-registry.json has cursor-expert
- Restart Cursor to reload registry
- Ask more open-ended questions

---

### Issue: Simple answers without options

**Possible Causes:**
1. Influencer.json not being loaded
2. Question doesn't match intervention points
3. AI bypassing expert system

**Fix:**
- Check influencer.json for syntax errors
- Use explicit @-mention: `@.cursor/experts/cursor-expert`
- Ask questions that require guidance, not facts

---

### Issue: Wrong confidence scores

**Possible Causes:**
1. AI interpreting rather than using actual scores
2. Scores not properly formatted

**Fix:**
- Verify JSON structure matches schema
- Ensure confidence values are numbers (0.9 not "0.9")
- Check for typos in recommendation IDs

---

## Advanced Testing

### Integration Test: Multi-Expert Orchestration

Once you have multiple experts active:

**Question:**
> "I want to build a new TypeScript feature in Cursor using Agent. What's the best approach?"

**Expected:**
- Consults cursor-expert for feature selection
- Consults typescript-expert for implementation patterns
- Synthesizes recommendations from both
- Shows how experts complement each other

---

### Performance Test: Response Time

**Measure:**
1. Time to first response
2. Completeness of recommendations
3. Token usage

**Acceptable:**
- Response within 3-5 seconds
- All options with full tradeoffs
- Reasonable token count (not excessive)

---

## Success Criteria Summary

The cursor-expert influencer is working correctly if:

✅ **Returns ranked options** (not single answers)  
✅ **Shows confidence scores** (0.0-1.0)  
✅ **Explains tradeoffs** (pros/cons for each)  
✅ **Provides context requirements** (when applicable)  
✅ **Lists decision factors** (how to choose)  
✅ **Cites sources** (recommendation IDs)  
✅ **Activates appropriately** (design phase, not execution)  
✅ **Feels natural** (human-like guidance)

---

## Next Steps

1. **Run Test Scenarios 1-6** above
2. **Document results** in test log
3. **Iterate on influencer.json** if needed
4. **Build next expert** (ai-integration-expert)
5. **Test multi-expert orchestration**

---

## Test Log Template

```markdown
## Test Run: [Date]

### Test 1: Feature Selection
- Question Asked: 
- Response Format: [Good/Bad]
- Options Provided: [Number]
- Confidence Scores: [Yes/No]
- Tradeoffs Explained: [Yes/No]
- Expert Cited: [Yes/No]
- **Status**: ✅ Pass / ❌ Fail

[Repeat for each test scenario]

### Overall Assessment:
- Expert System Functional: [Yes/No]
- Ready for Production: [Yes/No]
- Issues Found:
- Recommendations:
```

---

## Documentation References

- **Expert System Architecture**: `.cursor/experts/_docs/expert-system-architecture.md`
- **Influence Expert Spec**: `CursorAiStructureDev/experts/expert-design-docs/types/influence-expert.md`
- **Bootstrap Plan**: `.cursor/experts/BOOTSTRAP-PLAN.md`

---

*Last Updated: 2025-10-10 | Version: 1.0.0*

