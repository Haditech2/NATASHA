export default function BrandMark({ compact = false }) {
  return (
    <span className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-hidden="true">
      <img src="/images/pdp-mark.svg" alt="" />
    </span>
  )
}
