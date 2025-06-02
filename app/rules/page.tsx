"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { toast, ToastContainer } from 'react-toastify'
import { ConfirmationDialog } from "../../components/confirmation-dialog"
import { RulesTable } from "../../components/rules-table"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelector"
import { store } from "../../store"
import {
  addNewRuleSet,
  addRule,
  copyRuleSet,
  deleteRuleSet,
  saveRuleSetName,
  selectRuleSet,
  setEditMode,
  setRuleSets,
  updateRuleSetName,
} from "../../store/rulesSlice"

function RulesPageContent() {
  const dispatch = useAppDispatch()
  const { ruleSets, selectedRuleSetId, isEditMode, editingRuleSetName } = useAppSelector((state) => state.rules)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetch("/mock_data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data && data.rule_sets) {
          dispatch(setRuleSets(data.rule_sets))
        } else {
          console.error("Invalid data structure:", data)
          dispatch(setRuleSets([]))
        }
      })
      .catch((error) => {
        console.error("Error loading mock data:", error)
        const fallbackData = {
          rule_sets: [
            {
              id: 1,
              name: "Sample Ruleset",
              rules: [
                {
                  id: 1,
                  unitName: "",
                  findingName: "Sample Finding",
                  comparator: "not present",
                  measurement: "Sample Measurement",
                  comparedValue: 1,
                  action: "Normal",
                },
              ],
            },
          ],
        }
        dispatch(setRuleSets(fallbackData.rule_sets))
      })
  }, [dispatch])

  const selectedRuleSet = ruleSets.find((rs) => rs.id === selectedRuleSetId)

  const handleRuleSetChange = (value: string) => {
    if (value === "add_new") {
      dispatch(addNewRuleSet())
    } else {
      dispatch(selectRuleSet(Number(value)))
    }
  }

  const handleEditRules = () => {
    dispatch(setEditMode(true))
  }

  const handleSaveChanges = () => {
    dispatch(saveRuleSetName())
    dispatch(setEditMode(false))
    toast.success("Your ruleset has been updated successfully.")
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = () => {
    dispatch(setEditMode(false))
    setShowCancelDialog(false)
  }

  const handleAddNewRule = () => {
    dispatch(addRule())
  }

  const handleCopyRuleSet = () => {
    dispatch(copyRuleSet())
    toast.success("A copy of the ruleset has been created.")

  }

  const handleDeleteRuleSet = () => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteRuleSet = () => {
    dispatch(deleteRuleSet())
    setShowDeleteDialog(false)
    toast.success("The ruleset has been permanently removed.")

  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rules Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <Select value={selectedRuleSetId?.toString() || ""} onValueChange={handleRuleSetChange}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select a ruleset" />
                </SelectTrigger>
                <SelectContent>
                  {ruleSets.map((ruleSet) => (
                    <SelectItem key={ruleSet.id} value={ruleSet.id.toString()}>
                      {ruleSet.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new">+ Add New Ruleset</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isEditMode ? (
              <div className="flex gap-2">
                <Button onClick={handleEditRules} disabled={!selectedRuleSet}>
                  Edit Rules
                </Button>
                <Button variant="outline" onClick={handleCopyRuleSet} disabled={!selectedRuleSet}>
                  Copy Ruleset
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveChanges}>Save Changes</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleAddNewRule}>
                  Add New Rule
                </Button>
                <Button variant="destructive" onClick={handleDeleteRuleSet}>
                  Delete Ruleset
                </Button>
              </div>
            )}
          </div>

          {isEditMode && selectedRuleSet && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Ruleset Name</label>
              <Input
                value={editingRuleSetName}
                onChange={(e) => dispatch(updateRuleSetName(e.target.value))}
                placeholder="Enter ruleset name"
                className="max-w-md"
              />
            </div>
          )}

          <RulesTable />
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Changes"
        description="Are you sure you want to cancel? All unsaved changes will be lost."
        onConfirm={confirmCancel}
      />

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Ruleset"
        description="Are you sure you want to delete this ruleset? This action cannot be undone."
        onConfirm={confirmDeleteRuleSet}
      />
        <ToastContainer />
    </div>
  )
}

export default function RulesPage() {
  return (
    <Provider store={store}>
      <RulesPageContent />
    </Provider>
  )
}
