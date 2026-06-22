import React from 'react'

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-navy-900/10 shadow-[0_1px_3px_rgba(10,21,48,0.08)] p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6">
      <p className="font-mono-num text-xs tracking-[0.18em] uppercase text-gold-600">
        {eyebrow}
      </p>
      <h2 className="font-display text-2xl md:text-3xl text-navy-900 mt-1">{title}</h2>
      {description && <p className="text-navy-700/70 mt-2 max-w-2xl">{description}</p>}
    </div>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-navy-800 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-navy-900/15 bg-white px-3.5 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-400 outline-none transition-colors'

export function NumberInput({
  value,
  onChange,
  placeholder,
  suffix,
}: {
  value: number | ''
  onChange: (v: number | '') => void
  placeholder?: string
  suffix?: string
}) {
  return (
    <div className="relative">
      <input
        type="number"
        className={inputClass + (suffix ? ' pr-12' : '')}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-navy-400">
          {suffix}
        </span>
      )}
    </div>
  )
}

export function StatTile({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-4 border ${
        accent
          ? 'bg-navy-900 border-navy-900 text-white'
          : 'bg-gold-50 border-gold-100 text-navy-900'
      }`}
    >
      <p
        className={`text-xs uppercase tracking-wide font-mono-num ${
          accent ? 'text-gold-300' : 'text-navy-700/60'
        }`}
      >
        {label}
      </p>
      <p className="font-display text-xl md:text-2xl mt-1">{value}</p>
    </div>
  )
}

export function YearlyTable({
  rows,
}: {
  rows: { year: number; invested: number; value: number; profit: number }[]
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-navy-900/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-900 text-gold-100 text-left">
            <th className="px-4 py-2.5 font-medium">Year</th>
            <th className="px-4 py-2.5 font-medium">Invested Amount</th>
            <th className="px-4 py-2.5 font-medium">Portfolio Value</th>
            <th className="px-4 py-2.5 font-medium">Profit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.year}
              className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/40'}
            >
              <td className="px-4 py-2 font-mono-num text-navy-800">{row.year}</td>
              <td className="px-4 py-2 font-mono-num text-navy-700">
                ₹{row.invested.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-2 font-mono-num text-navy-900 font-medium">
                ₹{row.value.toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-2 font-mono-num text-green-700">
                ₹{row.profit.toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
