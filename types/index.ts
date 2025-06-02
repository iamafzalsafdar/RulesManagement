export interface Rule {
  id: number
  unitName: string
  findingName: string
  comparator: string
  measurement: string
  comparedValue: number
  action: string
}

export interface RuleSet {
  id: number
  name: string
  rules: Rule[]
}

export interface RulesState {
  ruleSets: RuleSet[]
  selectedRuleSetId: number | null
  isEditMode: boolean
  editingRuleSetName: string
}
