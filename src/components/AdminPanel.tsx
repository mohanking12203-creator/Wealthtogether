import React, { useState } from 'react'
import type { Fund, RiskProfile } from '../types'
import { Card, Field, inputClass, NumberInput, SectionTitle } from './ui'

const RISK_OPTIONS: RiskProfile[] = ['Low', 'Moderate', 'High']

export function AdminPanel({
  funds,
  setFunds,
}: {
  funds: Fund[]
  setFunds: (f: Fund[]) => void
}) {
  const [draft, setDraft] = useState<Fund>({
    name: '',
    category: 'Flexi Cap',
    commission: 0.83,
    expenseRatio: 1.0,
    riskLevel: 'Moderate',
  })
  const categories = Array.from(new Set(funds.map((f) => f.category)))

  function addFund() {
    if (!draft.name.trim()) return
    setFunds([...funds, draft])
    setDraft({ ...draft, name: '' })
  }

  function updateFund(index: number, patch: Partial<Fund>) {
    setFunds(funds.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  function removeFund(index: number) {
    setFunds(funds.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          eyebrow="Module 10"
          title="Admin Panel — Approved Fund Shelf"
          description="Manage the funds, categories, commission and expense ratios used across every module."
        />
        <div className="grid sm:grid-cols-5 gap-3 items-end mb-2">
          <Field label="Fund name">
            <input
              className={inputClass}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Quant Flexi Cap"
            />
          </Field>
          <Field label="Category">
            <input
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            />
          </Field>
          <Field label="Commission">
            <NumberInput
              value={draft.commission}
              onChange={(v) => setDraft({ ...draft, commission: Number(v) || 0 })}
              suffix="%"
            />
          </Field>
          <Field label="Expense ratio">
            <NumberInput
              value={draft.expenseRatio}
              onChange={(v) => setDraft({ ...draft, expenseRatio: Number(v) || 0 })}
              suffix="%"
            />
          </Field>
          <Field label="Risk level">
            <select
              className={inputClass}
              value={draft.riskLevel}
              onChange={(e) => setDraft({ ...draft, riskLevel: e.target.value as RiskProfile })}
            >
              {RISK_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button
          onClick={addFund}
          className="rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold px-5 py-2.5 text-sm transition-colors"
        >
          Add fund to shelf
        </button>
      </Card>

      {categories.map((category) => (
        <Card key={category}>
          <h3 className="font-display text-lg text-navy-900 mb-3">{category}</h3>
          <div className="overflow-x-auto rounded-lg border border-navy-900/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900 text-gold-100 text-left">
                  <th className="px-4 py-2 font-medium">Fund</th>
                  <th className="px-4 py-2 font-medium">Commission</th>
                  <th className="px-4 py-2 font-medium">Expense ratio</th>
                  <th className="px-4 py-2 font-medium">Risk</th>
                  <th className="px-4 py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {funds
                  .map((f, i) => ({ f, i }))
                  .filter(({ f }) => f.category === category)
                  .map(({ f, i }) => (
                    <tr key={f.name + i} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/40'}>
                      <td className="px-4 py-2 text-navy-900 font-medium">{f.name}</td>
                      <td className="px-4 py-2 font-mono-num">
                        <input
                          type="number"
                          className="w-20 rounded border border-navy-900/15 px-2 py-1"
                          value={f.commission}
                          onChange={(e) => updateFund(i, { commission: Number(e.target.value) })}
                        />
                        %
                      </td>
                      <td className="px-4 py-2 font-mono-num">
                        <input
                          type="number"
                          className="w-20 rounded border border-navy-900/15 px-2 py-1"
                          value={f.expenseRatio}
                          onChange={(e) => updateFund(i, { expenseRatio: Number(e.target.value) })}
                        />
                        %
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className="rounded border border-navy-900/15 px-2 py-1"
                          value={f.riskLevel}
                          onChange={(e) => updateFund(i, { riskLevel: e.target.value as RiskProfile })}
                        >
                          {RISK_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeFund(i)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  )
}
