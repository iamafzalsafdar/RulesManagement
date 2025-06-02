import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Rule, RuleSet, RulesState } from "../types"

const initialState: RulesState = {
  ruleSets: [],
  selectedRuleSetId: null,
  isEditMode: false,
  editingRuleSetName: "",
}

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    setRuleSets: (state, action: PayloadAction<RuleSet[]>) => {
      state.ruleSets = action.payload
      if (action.payload.length > 0 && !state.selectedRuleSetId) {
        state.selectedRuleSetId = action.payload[0].id
      }
    },
    selectRuleSet: (state, action: PayloadAction<number>) => {
      state.selectedRuleSetId = action.payload
      state.isEditMode = false
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload
      if (action.payload) {
        const selectedRuleSet = state.ruleSets.find((rs) => rs.id === state.selectedRuleSetId)
        state.editingRuleSetName = selectedRuleSet?.name || ""
      }
    },
    updateRuleSetName: (state, action: PayloadAction<string>) => {
      state.editingRuleSetName = action.payload
    },
    saveRuleSetName: (state) => {
      const ruleSetIndex = state.ruleSets.findIndex((rs) => rs.id === state.selectedRuleSetId)
      if (ruleSetIndex !== -1) {
        state.ruleSets[ruleSetIndex].name = state.editingRuleSetName
      }
    },
    addRule: (state) => {
      const ruleSetIndex = state.ruleSets.findIndex((rs) => rs.id === state.selectedRuleSetId)
      if (ruleSetIndex !== -1) {
        const newRule: Rule = {
          id: Date.now(),
          unitName: "",
          findingName: "",
          comparator: "is",
          measurement: "",
          comparedValue: -1,
          action: "Normal",
        }
        state.ruleSets[ruleSetIndex].rules.push(newRule)
      }
    },
    updateRule: (state, action: PayloadAction<{ ruleId: number; updates: Partial<Rule> }>) => {
      const ruleSetIndex = state.ruleSets.findIndex((rs) => rs.id === state.selectedRuleSetId)
      if (ruleSetIndex !== -1) {
        const ruleIndex = state.ruleSets[ruleSetIndex].rules.findIndex((r) => r.id === action.payload.ruleId)
        if (ruleIndex !== -1) {
          state.ruleSets[ruleSetIndex].rules[ruleIndex] = {
            ...state.ruleSets[ruleSetIndex].rules[ruleIndex],
            ...action.payload.updates,
          }
        }
      }
    },
    deleteRule: (state, action: PayloadAction<number>) => {
      const ruleSetIndex = state.ruleSets.findIndex((rs) => rs.id === state.selectedRuleSetId)
      if (ruleSetIndex !== -1) {
        state.ruleSets[ruleSetIndex].rules = state.ruleSets[ruleSetIndex].rules.filter(
          (rule) => rule.id !== action.payload,
        )
      }
    },
    copyRuleSet: (state) => {
      const selectedRuleSet = state.ruleSets.find((rs) => rs.id === state.selectedRuleSetId)
      if (selectedRuleSet) {
        const newRuleSet: RuleSet = {
          id: Date.now(),
          name: `${selectedRuleSet.name}_(1)`,
          rules: selectedRuleSet.rules.map((rule) => ({
            ...rule,
            id: Date.now() + Math.random(),
          })),
        }
        state.ruleSets.push(newRuleSet)
      }
    },
    addNewRuleSet: (state) => {
      const newRuleSet: RuleSet = {
        id: Date.now(),
        name: `New Ruleset ${state.ruleSets.length + 1}`,
        rules: [],
      }
      state.ruleSets.push(newRuleSet)
      state.selectedRuleSetId = newRuleSet.id
      state.isEditMode = true
      state.editingRuleSetName = newRuleSet.name
    },
    deleteRuleSet: (state) => {
      state.ruleSets = state.ruleSets.filter((rs) => rs.id !== state.selectedRuleSetId)
      if (state.ruleSets.length > 0) {
        state.selectedRuleSetId = state.ruleSets[0].id
      } else {
        state.selectedRuleSetId = null
      }
      state.isEditMode = false
    },
    moveRule: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const ruleSetIndex = state.ruleSets.findIndex((rs) => rs.id === state.selectedRuleSetId)
      if (ruleSetIndex !== -1) {
        const rules = state.ruleSets[ruleSetIndex].rules
        const [movedRule] = rules.splice(action.payload.fromIndex, 1)
        rules.splice(action.payload.toIndex, 0, movedRule)
      }
    },
  },
})

export const {
  setRuleSets,
  selectRuleSet,
  setEditMode,
  updateRuleSetName,
  saveRuleSetName,
  addRule,
  updateRule,
  deleteRule,
  copyRuleSet,
  addNewRuleSet,
  deleteRuleSet,
  moveRule,
} = rulesSlice.actions

export default rulesSlice.reducer
