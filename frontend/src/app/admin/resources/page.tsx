'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react'

export default function AdminResourcesPage() {
  const router = useRouter()

  const resources = [
    {
      title: 'Civic Issue Reporting Guidelines',
      description: 'Official guidelines for reporting and categorizing civic issues.',
      type: 'PDF',
      icon: '📋',
    },
    {
      title: 'Volunteer Training Manual',
      description: 'Training materials for volunteers on how to resolve civic issues.',
      type: 'DOC',
      icon: '📖',
    },
    {
      title: 'Issue Resolution SOP',
      description: 'Standard operating procedures for resolving different types of issues.',
      type: 'PDF',
      icon: '⚙️',
    },
    {
      title: 'Monthly Report Template',
      description: 'Template for generating monthly civic issue reports.',
      type: 'XLSX',
      icon: '📊',
    },
    {
      title: 'Emergency Contact Directory',
      description: 'Contact list for emergency services and city departments.',
      type: 'PDF',
      icon: '📞',
    },
    {
      title: 'City Zone Map',
      description: 'Interactive map showing city zones and responsible departments.',
      type: 'MAP',
      icon: '🗺️',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-5">

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-teal-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          📁 Admin Resources
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Documents, templates and guides for city administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <div
            key={resource.title}
            className="glass-card p-5 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0 text-xl">
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  {resource.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                  {resource.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full font-medium">
                    {resource.type}
                  </span>
                  <button className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-teal-600 transition-colors font-medium">
                    <ExternalLink className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 border-2 border-dashed border-[var(--border-color)] hover:border-teal-400 transition-colors text-center">
        <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
          Upload New Resource
        </p>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Drag and drop files here or click to browse
        </p>
        <button className="btn-primary text-xs py-2 px-6">
          Browse Files
        </button>
      </div>

      <div className="h-4" />
    </div>
  )
}
