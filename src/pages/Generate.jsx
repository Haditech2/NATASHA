import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  ImagePlus,
  Minus,
  RefreshCw,
  RotateCw,
  ShieldCheck,
  Upload,
  UserRound,
  WandSparkles,
  ZoomIn,
} from 'lucide-react'
import { IMAGE_PATHS, LGAS } from '../data'
import { saveGeneratedPoster } from '../lib/posters'

const PHOTO_BOX = { x: 1018, y: 525, width: 851, height: 828 }
const OUTER_BORDER = { x: 1004, y: 510, width: 881, height: 858, radius: 34 }

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function drawCover(ctx, image, box, transform, clipRadius = 0) {
  const rotation = ((transform.rotation % 360) + 360) % 360
  const quarterTurn = rotation === 90 || rotation === 270
  const rotatedWidth = quarterTurn ? image.naturalHeight : image.naturalWidth
  const rotatedHeight = quarterTurn ? image.naturalWidth : image.naturalHeight
  const scale = Math.max(box.width / rotatedWidth, box.height / rotatedHeight) * transform.zoom
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const coveredWidth = rotatedWidth * scale
  const coveredHeight = rotatedHeight * scale
  const maxShiftX = Math.max(0, (coveredWidth - box.width) / 2)
  const maxShiftY = Math.max(0, (coveredHeight - box.height) / 2)

  ctx.save()
  if (clipRadius) {
    roundRectPath(ctx, box.x, box.y, box.width, box.height, clipRadius)
    ctx.clip()
  } else {
    ctx.beginPath()
    ctx.rect(box.x, box.y, box.width, box.height)
    ctx.clip()
  }
  ctx.fillStyle = '#eef1ee'
  ctx.fillRect(box.x, box.y, box.width, box.height)
  ctx.translate(
    box.x + box.width / 2 + transform.x * maxShiftX,
    box.y + box.height / 2 + transform.y * maxShiftY,
  )
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
  ctx.restore()
}

function drawPoster(ctx, size, template, photo, transform, details) {
  ctx.clearRect(0, 0, size, size)
  ctx.drawImage(template, 0, 0, size, size)
  const ratio = size / 2000

  if (photo) {
    const photoBox = {
      x: PHOTO_BOX.x * ratio,
      y: PHOTO_BOX.y * ratio,
      width: PHOTO_BOX.width * ratio,
      height: PHOTO_BOX.height * ratio,
    }
    drawCover(ctx, photo, photoBox, transform, 24 * ratio)

    if (details.name || details.lga) {
      const stripHeight = 122 * ratio
      const stripY = photoBox.y + photoBox.height - stripHeight
      const gradient = ctx.createLinearGradient(photoBox.x, stripY, photoBox.x + photoBox.width, stripY)
      gradient.addColorStop(0, 'rgba(0,92,49,.96)')
      gradient.addColorStop(1, 'rgba(0,128,66,.92)')
      ctx.fillStyle = gradient
      ctx.fillRect(photoBox.x, stripY, photoBox.width, stripHeight)

      ctx.fillStyle = '#fff'
      ctx.font = `800 ${Math.round(34 * ratio)}px Arial, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const displayName = (details.name || 'Proud Supporter').toUpperCase().slice(0, 34)
      ctx.fillText(displayName, photoBox.x + photoBox.width / 2, stripY + 45 * ratio)
      ctx.font = `600 ${Math.round(24 * ratio)}px Arial, sans-serif`
      const location = [details.ward, details.lga ? `${details.lga} LGA` : ''].filter(Boolean).join(' · ')
      ctx.fillText(location.slice(0, 48), photoBox.x + photoBox.width / 2, stripY + 88 * ratio)
    }

    ctx.save()
    ctx.strokeStyle = '#07823f'
    ctx.lineWidth = 14 * ratio
    roundRectPath(
      ctx,
      OUTER_BORDER.x * ratio,
      OUTER_BORDER.y * ratio,
      OUTER_BORDER.width * ratio,
      OUTER_BORDER.height * ratio,
      OUTER_BORDER.radius * ratio,
    )
    ctx.stroke()
    ctx.restore()
  }
}

export default function Generate() {
  const navigate = useNavigate()
  const previewRef = useRef(null)
  const editorRef = useRef(null)
  const templateRef = useRef(null)
  const photoRef = useRef(null)
  const dragRef = useRef(null)

  const [photoUrl, setPhotoUrl] = useState('')
  const [transform, setTransform] = useState({ zoom: 1, x: 0, y: 0, rotation: 0 })
  const [details, setDetails] = useState({ name: '', lga: '', ward: '' })
  const [templateReady, setTemplateReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadImage(IMAGE_PATHS.template).then((image) => {
      templateRef.current = image
      setTemplateReady(true)
    })
  }, [])

  useEffect(() => {
    if (!templateReady || !previewRef.current) return
    drawPoster(previewRef.current.getContext('2d'), 1000, templateRef.current, photoRef.current, transform, details)
  }, [templateReady, photoUrl, transform, details])

  useEffect(() => {
    const canvas = editorRef.current
    const photo = photoRef.current
    if (!canvas || !photo) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    drawCover(ctx, photo, { x: 0, y: 0, width: canvas.width, height: canvas.height }, transform)
  }, [photoUrl, transform])

  const handleFile = (file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG or WEBP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('The selected image is larger than 10 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const image = await loadImage(reader.result)
        photoRef.current = image
        setPhotoUrl(reader.result)
        setTransform({ zoom: 1, x: 0, y: 0, rotation: 0 })
      } catch {
        setError('This image could not be opened. Please try a different file.')
      }
    }
    reader.readAsDataURL(file)
  }

  const updateTransform = (patch) => {
    setTransform((current) => ({ ...current, ...patch }))
  }

  const startDrag = (event) => {
    if (!photoRef.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, transform }
  }

  const moveDrag = (event) => {
    if (!dragRef.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = ((event.clientX - dragRef.current.x) / rect.width) * 2
    const dy = ((event.clientY - dragRef.current.y) / rect.height) * 2
    updateTransform({
      x: Math.max(-1, Math.min(1, dragRef.current.transform.x + dx)),
      y: Math.max(-1, Math.min(1, dragRef.current.transform.y + dy)),
    })
  }

  const endDrag = () => {
    dragRef.current = null
  }

  const generatePoster = async () => {
    setError('')
    if (!photoRef.current) {
      setError('Upload your photo before generating the poster.')
      return
    }
    if (!details.lga) {
      setError('Select your Local Government Area.')
      return
    }

    setBusy(true)
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const canvas = document.createElement('canvas')
      canvas.width = 2000
      canvas.height = 2000
      drawPoster(canvas.getContext('2d'), 2000, templateRef.current, photoRef.current, transform, details)
      const downloadUrl = canvas.toDataURL('image/jpeg', 0.94)

      const thumb = document.createElement('canvas')
      thumb.width = 800
      thumb.height = 800
      thumb.getContext('2d').drawImage(canvas, 0, 0, 800, 800)
      const thumbnail = thumb.toDataURL('image/jpeg', 0.78)
      const poster = {
        id: `poster-${Date.now()}`,
        name: details.name.trim() || 'Proud Supporter',
        lga: details.lga,
        ward: details.ward.trim(),
        quote: 'I reserve my vote for purposeful representation and visible progress.',
        image: thumbnail,
        createdAt: new Date().toISOString(),
      }

      saveGeneratedPoster(poster)
      sessionStorage.setItem('natasha-last-poster', JSON.stringify(poster))

      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `Natasha-2027-${details.lga.replace(/\s+/g, '-')}-Poster.jpg`
      document.body.appendChild(link)
      link.click()
      link.remove()

      navigate('/generate/success', { state: { poster, downloadUrl } })
    } catch (generationError) {
      console.error(generationError)
      setError('The poster could not be generated. Please try again.')
      setBusy(false)
    }
  }

  return (
    <section className="generator-page section">
      <div className="container generator-heading">
        <span className="eyebrow eyebrow--green"><WandSparkles size={14} /> Poster generator</span>
        <h1>Create Your Campaign Poster</h1>
        <p>Upload a clear photo, position it in the frame and download your personalized design.</p>
      </div>

      <div className="container generator-grid">
        <div className="generator-controls">
          {!photoUrl ? (
            <label className="upload-zone" htmlFor="photo-upload">
              <span className="upload-icon"><ImagePlus size={36} /></span>
              <strong>Upload Your Image</strong>
              <span>Click to browse your gallery</span>
              <small>JPG, PNG or WEBP · Max 10 MB</small>
              <span className="button button--green button--small"><Upload size={15} /> Choose Photo</span>
              <input id="photo-upload" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
            </label>
          ) : (
            <div className="crop-card">
              <div className="crop-card-heading">
                <div>
                  <strong>Position your photo</strong>
                  <span>Drag to reposition, then zoom if needed.</span>
                </div>
                <ShieldCheck size={20} />
              </div>
              <canvas
                ref={editorRef}
                className="crop-canvas"
                width="700"
                height="700"
                onPointerDown={startDrag}
                onPointerMove={moveDrag}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
              />
              <div className="crop-tools">
                <button type="button" title="Zoom out" onClick={() => updateTransform({ zoom: Math.max(1, transform.zoom - 0.1) })}><Minus size={18} /></button>
                <span className="zoom-value">{Math.round(transform.zoom * 100)}%</span>
                <button type="button" title="Zoom in" onClick={() => updateTransform({ zoom: Math.min(2.5, transform.zoom + 0.1) })}><ZoomIn size={18} /></button>
                <button type="button" title="Rotate" onClick={() => updateTransform({ rotation: (transform.rotation + 90) % 360 })}><RotateCw size={18} /></button>
                <button type="button" title="Reset" onClick={() => setTransform({ zoom: 1, x: 0, y: 0, rotation: 0 })}><RefreshCw size={18} /></button>
                <label className="change-photo" title="Change photo">
                  <Upload size={16} /> Change
                  <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
                </label>
              </div>
            </div>
          )}

          <div className="details-card">
            <div className="details-card-title">
              <UserRound size={20} />
              <div><strong>Your details</strong><span>These appear on your personalized poster.</span></div>
            </div>
            <label className="field">
              <span>Full Name <small>Optional</small></span>
              <input
                type="text"
                value={details.name}
                maxLength={48}
                placeholder="Enter your full name"
                onChange={(event) => setDetails({ ...details, name: event.target.value })}
              />
            </label>
            <label className="field">
              <span>Local Government</span>
              <select value={details.lga} onChange={(event) => setDetails({ ...details, lga: event.target.value })}>
                <option value="">Select Local Government</option>
                {LGAS.map((lga) => <option key={lga.name} value={lga.name}>{lga.name}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Ward <small>Optional</small></span>
              <input
                type="text"
                value={details.ward}
                maxLength={48}
                placeholder="Enter your ward"
                onChange={(event) => setDetails({ ...details, ward: event.target.value })}
              />
            </label>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button--green generate-button" type="button" disabled={busy} onClick={generatePoster}>
            {busy ? <><span className="spinner" /> Rendering Poster…</> : <><Download size={18} /> Generate & Download</>}
          </button>
          <p className="privacy-note"><ShieldCheck size={14} /> Your photo is processed only in this browser and is never uploaded to a server.</p>
        </div>

        <div className="generator-preview-column">
          <div className="generator-preview-sticky">
            <div className="preview-label"><span>Live Preview</span><small>Official square design · 2000 × 2000 px</small></div>
            <div className="poster-canvas-shell">
              <canvas ref={previewRef} width="1000" height="1000" aria-label="Live campaign poster preview" />
              {!templateReady && <span className="preview-loading"><span className="spinner spinner--green" /> Loading design…</span>}
            </div>
            <div className="preview-tip"><WandSparkles size={15} /> Your downloaded poster will be rendered in high resolution.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
