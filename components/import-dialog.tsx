"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import type { RuleSet } from "../types"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (ruleSets: RuleSet[]) => void
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [jsonString, setJsonString] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleImport = () => {
    try {
      const parsedData = JSON.parse(jsonString)

      if (!parsedData || !Array.isArray(parsedData)) {
        setError("Invalid JSON format. Expected an array of rulesets.")
        return
      }

      onImport(parsedData)
      onOpenChange(false)
      setError(null)
      setJsonString("")
    } catch (e: any) {
      setError(`Error parsing JSON: ${e.message}`)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Import Rulesets</AlertDialogTitle>
          <AlertDialogDescription>Paste your rulesets JSON here.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="textarea"
            placeholder="Paste JSON here"
            className="col-span-2"
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleImport}>Import</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
