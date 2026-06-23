import React, { useMemo, useState } from 'react'
import type { Lead, LeadGoal, LeadRiskProfile } from '../types'
import { Card, Field, SectionTitle, StatTile, inputClass } from './ui'

const RISK_OPTIONS: LeadRiskProfile[] = ['Conservative', 'Moderate', 'Aggressive']
const GOAL_OPTIONS: LeadGoal[] = ['Wealth Creation', 'Retirement', 'Child Education', 'Tax Saving']
const WHATSAPP_MESSAGE = `Hi Mohana Kumar,\nI would like a free consultation regarding mutual funds and financial planning.`

const initialForm = {
  name: '',
  mobile: '',
  email: '',
  age: '',
  monthlySip: '',
  riskProfile: 'Moderate' as LeadRiskProfile,
  goal: 'Wealth Creation' as LeadGoal,
}

function createLead(form: typeof initialForm): Lead {
  return {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...form,
  }
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isMobileValid(value: string) {
  const digits = value.replace(/\D/g, '')
  return /^\d{10}$/.test(digits)
}

export function LeadCapture({ onSaveLead }: { onSaveLead: (lead: Lead) => void }) {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)
  const [booked, setBooked] = useState(false)

  const emailValid = isEmailValid(form.email)
  const mobileValid = isMobileValid(form.mobile)
  const ageValid = !!form.age.trim()
  const sipValid = !!form.monthlySip.trim()
  const nameValid = !!form.name.trim()

  const formValid = nameValid && emailValid && mobileValid && ageValid && sipValid

  const lead = useMemo(() => createLead(form), [form])

  const handleSaveLead = () => {
    setSubmitted(true)
    if (!formValid) return
    onSaveLead(lead)
    setSaved(true)
  }

  const handleBookConsultation = () => {
    setSubmitted(true)
    if (!formValid) return
    onSaveLead(lead)
    setBooked(true)
    setSaved(true)
  }

  const resetForm = () => {
    setForm(initialForm)
    setSubmitted(false)
    setSaved(false)
    setBooked(false)
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  if (booked) {
    return (
      <div className="space-y-6">
        <Card>
          <SectionTitle
            eyebrow="Book Consultation"
            title="Your request is confirmed"
            description="Thank you for your interest. Our team will contact you shortly."
          />
          <div className="rounded-3xl border border-gold-100 bg-gold-50/80 p-6 text-center">
            <p className="text-sm text-navy-900/80 mb-3">Thank you for your interest.</p>
            <p className="font-display text-2xl text-navy-900 mb-1">WealthTogether Investments</p>
            <p className="text-base text-navy-700">Mohana Kumar T</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-900/10 transition hover:bg-navy-800"
            >
              Chat on WhatsApp
            </a>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-xl border border-navy-900/10 bg-white px-5 py-3 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-navy-50"
            >
              Book another consultation
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          eyebrow="Lead Capture"
          title="Book a free consultation"
          description="Collect lead details and build a consultation pipeline that can grow into Google Sheets, email alerts or CRM integration later."
        />
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name">
              <input
                className={`${inputClass} ${submitted && !nameValid ? 'border-red-500/70 ring-1 ring-red-200' : ''}`}
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value })
                  setSaved(false)
                }}
                placeholder="e.g. Asha Pillai"
              />
            </Field>
            <Field label="Mobile Number">
              <input
                className={`${inputClass} ${submitted && !mobileValid ? 'border-red-500/70 ring-1 ring-red-200' : ''}`}
                value={form.mobile}
                onChange={(e) => {
                  setForm({ ...form, mobile: e.target.value })
                  setSaved(false)
                }}
                placeholder="9876543210"
              />
            </Field>
            <Field label="Email Address">
              <input
                className={`${inputClass} ${submitted && !emailValid ? 'border-red-500/70 ring-1 ring-red-200' : ''}`}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                  setSaved(false)
                }}
                placeholder="example@mail.com"
              />
            </Field>
            <Field label="Age">
              <input
                type="number"
                className={`${inputClass} ${submitted && !ageValid ? 'border-red-500/70 ring-1 ring-red-200' : ''}`}
                value={form.age}
                onChange={(e) => {
                  setForm({ ...form, age: e.target.value })
                  setSaved(false)
                }}
                placeholder="33"
              />
            </Field>
            <Field label="Monthly SIP Budget">
              <input
                type="number"
                className={`${inputClass} ${submitted && !sipValid ? 'border-red-500/70 ring-1 ring-red-200' : ''}`}
                value={form.monthlySip}
                onChange={(e) => {
                  setForm({ ...form, monthlySip: e.target.value })
                  setSaved(false)
                }}
                placeholder="10000"
              />
            </Field>
            <Field label="Risk Profile">
              <div className="grid grid-cols-3 gap-2">
                {RISK_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, riskProfile: option })
                      setSaved(false)
                    }}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${
                      form.riskProfile === option
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-navy-700 border-navy-900/10 hover:border-gold-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Financial Goal">
              <select
                className={inputClass}
                value={form.goal}
                onChange={(e) => {
                  setForm({ ...form, goal: e.target.value as LeadGoal })
                  setSaved(false)
                }}
              >
                {GOAL_OPTIONS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="space-y-4 rounded-3xl border border-navy-900/10 bg-navy-950/5 p-5">
            <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Why this lead matters</p>
              <h3 className="font-display text-2xl text-navy-900 mt-3">Consultation ready lead capture</h3>
              <p className="mt-3 text-sm text-navy-700/80">
                Save each lead securely in the browser, then book a free consultation with a polished follow-up experience.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatTile label="Ready to save" value={formValid ? 'Yes' : 'Pending'} accent={formValid} />
              <StatTile label="Mobile valid" value={mobileValid ? 'Valid' : 'Check'} />
              <StatTile label="Email valid" value={emailValid ? 'Valid' : 'Check'} />
              <StatTile label="Future-ready" value="Google Sheets / CRM" />
            </div>
            <div className="rounded-3xl border border-gold-100 bg-gold-50/80 p-4 text-sm text-navy-900">
              <p className="font-medium">Next step</p>
              <p className="mt-2 leading-6 text-navy-700/85">
                Save the lead and choose Book Free Consultation to record the request and surface the booking confirmation with WealthTogether branding.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleSaveLead}
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-900 border border-navy-900/10 shadow-sm transition hover:bg-navy-50"
          >
            Save Lead
          </button>
          <button
            type="button"
            onClick={handleBookConsultation}
            className="inline-flex items-center justify-center rounded-xl bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/15 transition hover:bg-gold-600"
          >
            Book Free Consultation
          </button>
        </div>

        {submitted && !formValid && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Please check the highlighted fields and complete mobile, email, age and SIP budget.
          </div>
        )}
        {saved && formValid && !booked && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Lead saved successfully. You can still book a free consultation when you are ready.
          </div>
        )}
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono-num text-xs uppercase tracking-[0.18em] text-gold-600">WealthTogether support</p>
            <h3 className="font-display text-2xl text-navy-900">Keep the experience consistent</h3>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            Chat on WhatsApp
          </a>
        </div>
        <p className="mt-3 text-sm text-navy-700/80">
          The WhatsApp message opens a new chat with your branded consultation request pre-filled for a fast follow-up.
        </p>
      </Card>
    </div>
  )
}
