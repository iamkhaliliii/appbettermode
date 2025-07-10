"use client";

import { useState } from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives/button";
import { FormCardProps, SocialCardProps } from "./types";

export function FormCard({ form, isPreview = false, onFormClick, isFormOpen = false, isInModal = false }: FormCardProps) {
  if (!form) return null;

  return (
    <div 
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isFormOpen && isInModal
          ? 'border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20'
          : isInModal
          ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-800/30'
          : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-800/30 hover:bg-zinc-50 dark:hover:bg-zinc-800/70'
              } ${!isPreview && !isInModal ? 'cursor-pointer' : ''}`}
      onClick={!isPreview && !isInModal && !isFormOpen ? onFormClick : undefined}
    >
      {/* Form Header */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Form
            </h4>
          </div>
          <Badge variant="outline" className="text-xs">
            {form.responses} responses
          </Badge>
        </div>
        <h5 className="text-xl font-medium text-zinc-800 dark:text-zinc-200 mb-2">
          {form.title}
        </h5>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
          {form.description}
        </p>
        
        {/* Collapsed State Info */}
        {(!isFormOpen || !isInModal) && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {form.fields.length} questions
            </span>
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <span>Fill Form</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Form Content - Only show in modal when open */}
      {isFormOpen && isInModal && (
        <div className="border-t border-zinc-200 dark:border-zinc-700">
          <div className="p-5">
            <div className="space-y-4">
              {form.fields.map((field: { id: string; label: string; type: "text" | "textarea" | "select" | "radio"; options?: string[]; placeholder?: string; required: boolean; }) => (
                <div key={field.id} className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === "text" && (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  
                  {field.type === "textarea" && (
                    <textarea
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  )}
                  
                  {field.type === "select" && (
                    <select className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select an option...</option>
                      {field.options?.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === "radio" && (
                    <div className="space-y-2">
                      {field.options?.map((option: string) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            className="w-4 h-4 text-blue-600 border-zinc-300 dark:border-zinc-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              >
                {form.submitText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

 