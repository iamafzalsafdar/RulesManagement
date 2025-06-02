"use client"

import { useEffect, useRef } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RuleRow } from "./rule-row"
import { useAppSelector } from "../hooks/useAppSelector"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { moveRule } from "../store/rulesSlice"

export function RulesTable() {
  const dispatch = useAppDispatch()
  const { ruleSets, selectedRuleSetId, isEditMode } = useAppSelector((state) => state.rules)
  const tableRef = useRef<HTMLDivElement>(null)

  const selectedRuleSet = ruleSets.find((rs) => rs.id === selectedRuleSetId)
  const rules = selectedRuleSet?.rules || []

  useEffect(() => {
    if (tableRef.current && isEditMode) {
      const tableElement = tableRef.current
      tableElement.scrollTop = tableElement.scrollHeight
    }
  }, [rules.length, isEditMode])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isEditMode) return

    dispatch(
      moveRule({
        fromIndex: result.source.index,
        toIndex: result.destination.index,
      }),
    )
  }

  if (!selectedRuleSet) {
    return <div className="text-center py-8 text-muted-foreground">No ruleset selected</div>
  }

  return (
    <div ref={tableRef} className="border rounded-lg overflow-auto max-h-[600px]">
      <Table>
        <TableHeader>
          <TableRow>
            {isEditMode && <TableHead className="w-12"></TableHead>}
            <TableHead>Measurement Name</TableHead>
            <TableHead>Comparator</TableHead>
            <TableHead>Compared Value</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Finding Name</TableHead>
            <TableHead>Action</TableHead>
            {isEditMode && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        {isEditMode ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {rules.map((rule, index) => (
                    <Draggable key={rule.id} draggableId={rule.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <RuleRow
                          key={rule.id}
                          rule={rule}
                          isEditMode={isEditMode}
                          isDragging={snapshot.isDragging}
                          dragHandleProps={provided.dragHandleProps}
                          draggableProps={provided.draggableProps}
                          innerRef={provided.innerRef}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <TableBody>
            {rules.map((rule) => (
              <RuleRow key={rule.id} rule={rule} isEditMode={isEditMode} />
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  )
}
