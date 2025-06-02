"use client"

import { useState } from "react"
import { Pencil, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import type { Rule } from "../types"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { updateRule, deleteRule } from "../store/rulesSlice"

interface RuleRowProps {
  rule: Rule
  isEditMode: boolean
  isDragging?: boolean
  dragHandleProps?: any
  draggableProps?: any
  innerRef?: any
}

export function RuleRow({ rule, isEditMode, isDragging, dragHandleProps, draggableProps, innerRef }: RuleRowProps) {
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editedRule, setEditedRule] = useState(rule)

  const handleSave = () => {
    dispatch(updateRule({ ruleId: rule.id, updates: editedRule }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedRule(rule)
    setIsEditing(false)
  }

  const handleDelete = () => {
    dispatch(deleteRule(rule.id))
  }

  const handleComparatorChange = (value: string) => {
    const newRule = { ...editedRule, comparator: value as Rule["comparator"] }
    if (value === "is") {
      newRule.comparedValue = -1
      newRule.unitName = ""
    }
    setEditedRule(newRule)
  }

  if (isEditing) {
    return (
      <TableRow ref={innerRef} {...draggableProps} className={isDragging ? "opacity-50" : ""}>
        {isEditMode && (
          <TableCell>
            <div {...dragHandleProps} className="cursor-grab">
              <GripVertical className="h-4 w-4" />
            </div>
          </TableCell>
        )}
        <TableCell>
          <Input
            value={editedRule.measurement}
            onChange={(e) => setEditedRule({ ...editedRule, measurement: e.target.value })}
            placeholder="Measurement Name"
          />
        </TableCell>
        <TableCell>
          <Select value={editedRule.comparator} onValueChange={handleComparatorChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="is">is</SelectItem>
              <SelectItem value=">=">{">="}</SelectItem>
              <SelectItem value="<">{"<"}</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          {editedRule.comparator === "is" ? (
            <Input value="Not Present" disabled />
          ) : (
            <Input
              type="number"
              value={editedRule.comparedValue === -1 ? "" : editedRule.comparedValue}
              onChange={(e) => setEditedRule({ ...editedRule, comparedValue: Number(e.target.value) || 0 })}
              placeholder="Value"
            />
          )}
        </TableCell>
        <TableCell>
          {editedRule.comparator !== "is" && (
            <Input
              value={editedRule.unitName}
              onChange={(e) => setEditedRule({ ...editedRule, unitName: e.target.value })}
              placeholder="Unit"
            />
          )}
        </TableCell>
        <TableCell>
          <Input
            value={editedRule.findingName}
            onChange={(e) => setEditedRule({ ...editedRule, findingName: e.target.value })}
            placeholder="Finding Name"
          />
        </TableCell>
        <TableCell>
          <Select
            value={editedRule.action}
            onValueChange={(value) => setEditedRule({ ...editedRule, action: value as Rule["action"] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Reflux">Reflux</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        {isEditMode && (
          <TableCell>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>
    )
  }

  return (
    <TableRow ref={innerRef} {...draggableProps} className={isDragging ? "opacity-50" : ""}>
      {isEditMode && (
        <TableCell>
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-4 w-4" />
          </div>
        </TableCell>
      )}
      <TableCell>{rule.measurement}</TableCell>
      <TableCell>{rule.comparator === "not present" ? "is" : rule.comparator}</TableCell>
      <TableCell>
        {rule.comparator === "not present" || rule.comparedValue === -1 ? "Not Present" : rule.comparedValue}
      </TableCell>
      <TableCell>{rule.unitName || "-"}</TableCell>
      <TableCell>{rule.findingName}</TableCell>
      <TableCell>{rule.action}</TableCell>
      {isEditMode && (
        <TableCell>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  )
}
