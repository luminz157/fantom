'use client'

import { useState, useCallback } from 'react'

interface GeolocationState {
  lat: number | null
  lng: number | null
  address: string
  loading: boolean
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    address: '',
    loading: false,
    error: null,
  })

  const fetchLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation not supported by your browser.' }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // Free reverse geocoding — no API key needed
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          )
          const data = await res.json()
          const parts = data.display_name?.split(',') ?? []
          const address = parts.slice(0, 4).join(',').trim()

          setState({
            lat: latitude,
            lng: longitude,
            address: address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            loading: false,
            error: null,
          })
        } catch {
          setState({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            loading: false,
            error: null,
          })
        }
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err.code === 1
              ? 'Location permission denied. Please allow location access.'
              : err.code === 2
              ? 'Location unavailable. Check your GPS settings.'
              : 'Location request timed out. Try again.',
        }))
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }, [])

  const reset = useCallback(() => {
    setState({ lat: null, lng: null, address: '', loading: false, error: null })
  }, [])

  const setManualAddress = useCallback((address: string) => {
    setState((prev) => ({ ...prev, address }))
  }, [])

  return {
    ...state,
    fetchLocation,
    reset,
    setManualAddress,
    hasLocation: state.lat !== null && state.lng !== null,
  }
}
```

---

## ✅ Your `hooks/` folder is now complete:
```
src/hooks/
├── useAuth.ts          ✅
├── useChat.ts          ✅
├── useIssues.ts        ✅
└── useGeolocation.ts   ✅ (new)