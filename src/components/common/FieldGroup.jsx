export function FieldGroup({ label, required, hint, error, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm text-muted-foreground">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
      {hint && <div className="mt-1.5 text-xs text-muted-foreground">{hint}</div>}
      {error && <div className="mt-1.5 text-xs text-primary">{error}</div>}
    </div>
  )
}
