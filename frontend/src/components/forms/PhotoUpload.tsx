'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Camera, X, RefreshCw, CheckCircle } from 'lucide-react'

interface PhotoUploadProps {
  onPhotoCapture: (dataUrl: string) => void
  capturedPhoto?: string
  onClear?: () => void
}

export function PhotoUpload({ onPhotoCapture, capturedPhoto, onClear }: PhotoUploadProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [capturing, setCapturing] = useState(false)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

  // Open camera
  const openCamera = useCallback(async (mode: 'environment' | 'user' = 'environment') => {
    setCameraError('')
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream
      setCameraOpen(true)

      // Assign stream after DOM renders
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      }, 100)
    } catch (err: any) {
      const msg =
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access.'
          : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : 'Could not open camera. Try again.'
      setCameraError(msg)
    }
  }, [])

  // Close camera
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOpen(false)
  }, [])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    setCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)

    onPhotoCapture(dataUrl)
    closeCamera()
    setCapturing(false)
  }, [onPhotoCapture, closeCamera])

  // Flip camera
  const flipCamera = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    openCamera(next)
  }, [facingMode, openCamera])

  return (
    <div className="space-y-3">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera view */}
      {cameraOpen && (
        <div className="relative rounded-xl overflow-hidden border-2 border-teal-400 dark:border-teal-600 bg-black animate-fade-in">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-h-64 object-cover"
          />

          {/* Camera UI overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-6 h-6 border-teal-400`}
                style={{
                  borderTopWidth: i < 2 ? 3 : 0,
                  borderBottomWidth: i >= 2 ? 3 : 0,
                  borderLeftWidth: i % 2 === 0 ? 3 : 0,
                  borderRightWidth: i % 2 === 1 ? 3 : 0,
                  borderStyle: 'solid',
                }}
              />
            ))}
          </div>

          {/* Controls bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
            {/* Flip */}
            <button
              onClick={flipCamera}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>

            {/* Capture */}
            <button
              onClick={capturePhoto}
              disabled={capturing}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95 disabled:opacity-70"
            >
              <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center">
                {capturing
                  ? <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-5 h-5 text-teal-600" />
                }
              </div>
            </button>

            {/* Close */}
            <button
              onClick={closeCamera}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {cameraError && !cameraOpen && (
        <div className="flex items-start gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3">
          <span className="text-rose-500 text-sm mt-0.5">⚠️</span>
          <p className="text-xs text-rose-600 dark:text-rose-400">{cameraError}</p>
        </div>
      )}

      {/* Captured photo preview */}
      {capturedPhoto && !cameraOpen && (
        <div className="relative rounded-xl overflow-hidden border-2 border-teal-400 dark:border-teal-600 animate-fade-in">
          <img
            src={capturedPhoto}
            alt="Captured issue"
            className="w-full max-h-48 object-cover"
          />
          {/* Success overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-teal-500/90 backdrop-blur rounded-full px-2.5 py-1">
            <CheckCircle className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-semibold">Photo captured</span>
          </div>
          {/* Retake / Clear */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => openCamera(facingMode)}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur flex items-center justify-center hover:bg-black/70 transition-colors"
              title="Retake"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              type="button"
              onClick={onClear}
              className="w-7 h-7 rounded-full bg-rose-500/80 backdrop-blur flex items-center justify-center hover:bg-rose-600 transition-colors"
              title="Remove"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Open camera button — shown when no photo and camera is closed */}
      {!capturedPhoto && !cameraOpen && (
        <button
          type="button"
          onClick={() => openCamera('environment')}
          className="w-full flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed
                     border-[var(--border-color)] hover:border-teal-400 dark:hover:border-teal-600
                     hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 border-2 border-teal-200 dark:border-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-teal-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Take a Photo</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Opens your device camera directly
            </p>
          </div>
        </button>
      )}
    </div>
  )
}