import React, { useMemo } from 'react'
import type { Lead } from '../types'
import { Card, SectionTitle } from './ui'

function formatDate(isoDate: string) {
  const date = new Date(isoDate)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function LeadAdmin({ leads }: { leads: Lead[] }) {
  const totals = useMemo(
    () => ({
      totalLeads: leads.length,
      totalSip: leads.reduce((sum, lead) => sum + Number(lead.monthlySip || 0), 0),
      conservative: leads.filter((lead) => lead.riskProfile === 'Conservative').length,
      moderate: leads.filter((lead) => lead.riskProfile === 'Moderate').length,
      aggressive: leads.filter((lead) => lead.riskProfile === 'Aggressive').length,
    }),
    [leads]
  )

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          eyebrow="Admin Leads"
          title="Lead pipeline summary"
          description="Review the consultation-ready leads captured from the booking module and track monthly SIP potential by risk profile."
        />
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Total leads</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">{totals.totalLeads}</p>
          </div>
          <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Monthly SIP potential</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">₹{totals.totalSip.toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Conservative</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">{totals.conservative}</p>
          </div>
          <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Moderate</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">{totals.moderate}</p>
          </div>
          <div className="rounded-3xl border border-navy-900/10 bg-white p-5 shadow-sm sm:col-span-4 md:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-600">Aggressive</p>
            <p className="mt-3 text-3xl font-semibold text-navy-900">{totals.aggressive}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto rounded-3xl border border-navy-900/10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-navy-900 text-gold-100 text-left">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">SIP Budget</th>
                <th className="px-4 py-3 font-medium">Goal</th>
                <th className="px-4 py-3 font-medium">Risk Profile</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-navy-700/70">
                    No leads captured yet. Use Book Consultation to save your first lead.
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-navy-50/40'}
                  >
                    <td className="px-4 py-3 text-navy-700">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3 font-medium text-navy-900">{lead.name}</td>
                    <td className="px-4 py-3 text-navy-700">{lead.mobile}</td>
                    <td className="px-4 py-3 text-navy-700">{lead.email}</td>
                    <td className="px-4 py-3 text-navy-700">{lead.age}</td>
                    <td className="px-4 py-3 font-mono-num text-navy-900">₹{Number(lead.monthlySip).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-navy-700">{lead.goal}</td>
                    <td className="px-4 py-3 text-navy-700">{lead.riskProfile}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
