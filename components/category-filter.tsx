/*
 * Copyright 2025, Orange Bricks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use client"

import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  disabled?: boolean
}

// Define available categories - these should match the ai_category values in Supabase
export const CATEGORIES = [
  { id: "", label: "All" },
  { id: "AI & Code Assistance", label: "AI & Code Assistance" },
  { id: "Data & Database Integration", label: "Data & Database Integration" },
  { id: "Visualization & Dashboards", label: "Visualization & Dashboards" },
  { id: "Educational & Grading", label: "Educational & Grading" },
  { id: "Cloud & Platform Integration", label: "Cloud & Platform Integration" },
  { id: "Development & Version Control", label: "Development & Version Control" },
  { id: "System & Resource Management", label: "System & Resource Management" },
  { id: "Specialized Computing", label: "Specialized Computing" },
  { id: "Workflow & Automation", label: "Workflow & Automation" },
  { id: "Runtime & Kernel Extensions", label: "Runtime & Kernel Extensions" },
  { id: "Theme", label: "Theme" },
  { id: "__NULL__", label: "Other" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange, disabled = false }: CategoryFilterProps) {
  // Helper to get hover class for each category
  const getHoverClass = (categoryId: string) => {
    if (categoryId === "") return "hover:bg-muted/50" // Subtle hover for "All"
    
    const hoverMap: Record<string, string> = {
      "AI & Code Assistance": "hover:bg-purple-100 hover:text-purple-800 dark:hover:bg-purple-900/40 dark:hover:text-purple-200",
      "Data & Database Integration": "hover:bg-green-100 hover:text-green-800 dark:hover:bg-green-900/40 dark:hover:text-green-200",
      "Visualization & Dashboards": "hover:bg-pink-100 hover:text-pink-800 dark:hover:bg-pink-900/40 dark:hover:text-pink-200",
      "Educational & Grading": "hover:bg-yellow-100 hover:text-yellow-800 dark:hover:bg-yellow-900/40 dark:hover:text-yellow-200",
      "Cloud & Platform Integration": "hover:bg-cyan-100 hover:text-cyan-800 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-200",
      "Development & Version Control": "hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/40 dark:hover:text-blue-200",
      "System & Resource Management": "hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-900/40 dark:hover:text-slate-200",
      "Specialized Computing": "hover:bg-teal-100 hover:text-teal-800 dark:hover:bg-teal-900/40 dark:hover:text-teal-200",
      "Workflow & Automation": "hover:bg-orange-100 hover:text-orange-800 dark:hover:bg-orange-900/40 dark:hover:text-orange-200",
      "Runtime & Kernel Extensions": "hover:bg-indigo-100 hover:text-indigo-800 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-200",
      "Theme": "hover:bg-rose-100 hover:text-rose-800 dark:hover:bg-rose-900/40 dark:hover:text-rose-200",
      "__NULL__": "hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-900/40 dark:hover:text-amber-200",
    }
    
    return hoverMap[categoryId] || "hover:bg-muted/50"
  }

  return (
    <div className="w-full overflow-x-auto pb-2 -mb-2">
      <div className="flex gap-2 min-w-max">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id
          // Use primary color for "All", otherwise use category colors
          const colorClass = category.id === "" 
            ? "bg-primary text-primary-foreground"
            : getCategoryBadgeColor(category.id === "__NULL__" ? null : category.id)
          const hoverClass = getHoverClass(category.id)
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              disabled={disabled}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${isSelected 
                  ? colorClass
                  : `border border-border bg-transparent text-foreground ${hoverClass}`
                }
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              `}
              aria-pressed={isSelected}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Helper function to get category label by ID
export function getCategoryLabel(categoryId: string | null): string {
  if (!categoryId) return "Other"
  const category = CATEGORIES.find(c => c.id === categoryId)
  return category?.label || categoryId
}

// Helper function to get category badge styling
export function getCategoryBadgeColor(categoryId: string | null): string {
  // Handle NULL values (Other category)
  if (!categoryId) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
  
  switch (categoryId) {
    case "AI & Code Assistance":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200"
    case "Data & Database Integration":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
    case "Visualization & Dashboards":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200"
    case "Educational & Grading":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
    case "Cloud & Platform Integration":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200"
    case "Development & Version Control":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
    case "System & Resource Management":
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
    case "Specialized Computing":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200"
    case "Workflow & Automation":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
    case "Runtime & Kernel Extensions":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200"
    case "Theme":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200"
    case "__NULL__":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }
}
