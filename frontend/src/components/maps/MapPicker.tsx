'use client'

import React, { useState } from 'react'
import { MapPin, Navigation, Loader2, AlertCircle, Edit3, Check } from 'lucide-react'
import { useGeolocation } from '@/hooks/useGeolocation'

interface MapPickerProps {
  onLocationSet: (location: { lat?: number; lng?: number; address: string }) => void
  currentAddress?: string
}

export function MapPicker({ onLocationSet, currentAddress }: MapPickerProps) {
  const {
    lat, lng, address, loading, error,
    fetchLocation, setManualAddress, hasLocation,
  } = useGeolocation()

  const [manualMode, setManualMode] = useState(false)
  const [manualInput, setManualInput] = useState(currentAddress ?? '')
  const [manualSaved, setManualSaved] = useState(false)

  async function handleFetchLocation() {
    setManualMode(false)
    setManualSaved(false)
    await fetchLocation()
  }

  React.useEffect(() => {
    if (hasLocation && address) {
      onLocationSet({ lat: lat!, lng: lng!, address })
    }
  }, [hasLocation, address, lat, lng])

  function handleManualSave() {
    if (!manualInput.trim()) return
    setManualAddress(manualInput)
    onLocationSet({ address: manualInput })
    setManualSaved(true)
  }

  return (
    <div className="space-y-3">
      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleFetchLocation}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            hasLocation && !manualMode
              ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400'
              : 'bg-white dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400 hover:text-teal-600'
          }`}
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Navigation className="w-4 h-4" />
          }
          {loading ? 'Locating...' : hasLocation && !manualMode ? '✓ Location Found' : 'Use My Location'}
        </button>

        <button
          type="button"
          onClick={() => { setManualMode(!manualMode); setManualSaved(false) }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
            manualMode
              ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-600 dark:text-teal-400'
              : 'bg-white dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-secondary)] hover:border-teal-400'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Enter Manually
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
        </div>
      )}

      {/* Manual input */}
      {manualMode && (
        <div className="flex gap-2 animate-slide-up">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => { setManualInput(e.target.value); setManualSaved(false) }}
              placeholder="e.g. MG Road, Bengaluru"
              className="input-base pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleManualSave()}
            />
          </div>
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!manualInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-teal-500 text-white text-xs font-semibold
                       hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {manualSaved ? 'Saved!' : 'Set'}
          </button>
        </div>
      )}

      {/* Map preview card */}
      {(hasLocation || manualSaved) && (
        <div className="rounded-xl overflow-hidden border border-teal-200 dark:border-teal-800 animate-fade-in">
          {/* Map visual */}
          <div
            className="relative h-32 flex items-center justify-center"
            style={{
              backgroundImage: `
                linear-gradient(rgba(20,184,166,0.25) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20,184,166,0.25) 1px, transparent 1px),
                linear-gradient(135deg, #0f766e 0%, #0e7490 100%)
              `,
              backgroundSize: '30px 30px, 30px 30px, 100% 100%',
            }}
          >
            {/* Animated pin */}
            <div className="relative animate-float">
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-rose-400 animate-ping"
                  style={{ animationDelay: `${i * 300}ms`, animationDuration: '2s', opacity: 1 / i }}
                />
              ))}
            </div>

            {/* Coords badge */}
            {hasLocation && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur rounded-lg px-2 py-1">
                <p className="text-teal-300 text-xs font-mono">
                  {lat?.toFixed(4)}, {lng?.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          {/* Address row */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-teal-50 dark:bg-teal-900/30">
            <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0" />
            <p className="text-xs font-medium text-teal-700 dark:text-teal-300 truncate">
              {manualSaved && manualMode ? manualInput : address}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}