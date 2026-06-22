import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ClientProfile } from '../types'
import { PORTFOLIOS } from '../data/funds'
import {
  sipProjection,
  formatINR,
  getRiskReturnAssumption,
  validateFundAllocation,
} from '../utils/calculations'
import { Card, YearlyTable } from './ui'

const COLORS = ['#0a1530', '#c4943a', '#2c4f9e', '#d9ad4a', '#162a5c']
const RECOMMENDATION_REASONS: Record<string, string> = {
  'HDFC Flexi Cap': 'Core portfolio stability',
  'ICICI Large & Mid Cap': 'Growth-oriented diversification',
  'SBI Contra': 'Contrarian long-term opportunity'
}
const RISK_PROFILE_EXPLANATION: Record<string, string> = {
  Low: 'A conservative approach focused on capital preservation, stable cash flow, and lower volatility over time.',
  Moderate:
    'A balanced strategy designed to capture reasonable growth while keeping risk under control for long-term wealth creation.',
  High: 'An aggressive allocation approach that prioritises long-term growth potential and can tolerate short-term market fluctuations.'
}
const ADVISOR_NOTES = [
  'Maintain a disciplined SIP approach and avoid reacting to short-term market volatility.',
  'Review the portfolio annually to rebalance based on goals, life stage, and risk appetite.',
  'Prioritise long-term investing and keep emergency reserves separate from market-linked assets.'
]

export function ClientReport({ profile }: { profile: ClientProfile }) {
  const sip = Number(profile.monthlySip) || 0
  const years = Number(profile.durationYears) || 0
  const allocation = PORTFOLIOS[profile.riskProfile]
  const expectedReturn = getRiskReturnAssumption(profile.riskProfile)
  const { validatedAllocations, warning } = useMemo(
    () => validateFundAllocation(allocation, sip),
    [allocation, sip]
  )
  const projection = useMemo(
    () => (sip > 0 && years > 0 ? sipProjection(sip, expectedReturn, years) : null),
    [sip, years, expectedReturn]
  )

  const pieData = validatedAllocations.map((a) => ({ name: a.fund, value: a.percent }))
  const expectedCorpus = projection?.corpus ?? 0
  const totalInvested = projection?.totalInvested ?? 0
  const wealthCreated = projection?.wealthCreated ?? 0
  const wealthMultiple = totalInvested > 0 ? expectedCorpus / totalInvested : 0
  const goalName = profile.name ? `${profile.name.split(' ')[0]}'s Wealth Goal` : 'Personal Wealth Goal'
  const monthlyFundAllocation = validatedAllocations
  const riskProfileExplanation = RISK_PROFILE_EXPLANATION[profile.riskProfile]

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 40

    const addHeader = (pageNumber: number, totalPages: number) => {
      doc.setFillColor(10, 21, 48)
      doc.rect(0, 0, pageWidth, 76, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('WealthTogether Investments', margin, 28)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Invest Early. Stay Consistent. Let Time Build Wealth.', margin, 48)
      doc.setFontSize(10)
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-IN')}`,
        pageWidth - margin,
        28,
        { align: 'right' }
      )
      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        48,
        { align: 'right' }
      )
      doc.setTextColor(0, 0, 0)
    }

    const addFooter = (pageNumber: number, totalPages: number) => {
      doc.setDrawColor(225, 229, 236)
      doc.line(margin, pageHeight - 58, pageWidth - margin, pageHeight - 58)
      doc.setTextColor(64, 81, 110)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('WealthTogether Investments', margin, pageHeight - 38)
      doc.text('Prepared by Mohana Kumar T', margin + 220, pageHeight - 38)
      doc.text('Mutual Fund Distributor', margin + 420, pageHeight - 38)
      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 38,
        { align: 'right' }
      )
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.text(
        'Disclaimer: Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.',
        margin,
        pageHeight - 18,
        { maxWidth: pageWidth - margin * 2 }
      )
      doc.setTextColor(0, 0, 0)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.text('Personal Financial Planning Report', margin, 106)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Prepared for ${profile.name || 'Client'}`, margin, 128)

    doc.setFillColor(245, 248, 252)
    doc.roundedRect(margin, 142, pageWidth - margin * 2, 76, 6, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('Prepared By:', margin + 18, 166)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Mohana Kumar T', margin + 18, 186)
    doc.text('AMFI Registered Mutual Fund Distributor', margin + 18, 204)
    doc.text('WealthTogether Investments', margin + 18, 222)

    const summaryY = 240
    const summaryCards = [
      { label: 'Monthly SIP', value: formatINR(sip || 0) },
      { label: 'Total Investment', value: formatINR(totalInvested) },
      { label: 'Expected Corpus', value: formatINR(expectedCorpus) },
      { label: 'Wealth Created', value: formatINR(wealthCreated) },
      { label: 'Wealth Multiple', value: wealthMultiple.toFixed(2) + 'x' }
    ]
    const cardWidth = (pageWidth - margin * 2 - 16) / summaryCards.length

    summaryCards.forEach((card, index) => {
      const x = margin + index * (cardWidth + 4)
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(x, summaryY, cardWidth, 64, 5, 5, 'F')
      doc.setDrawColor(228, 234, 247)
      doc.roundedRect(x, summaryY, cardWidth, 64, 5, 5, 'S')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(96, 106, 128)
      doc.text(card.label, x + 10, summaryY + 18)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(10, 21, 48)
      doc.text(card.value, x + 10, summaryY + 42)
    })

    doc.setFillColor(252, 248, 236)
    doc.roundedRect(margin, 330, pageWidth - margin * 2, 66, 6, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(10, 21, 48)
    doc.text('Goal Summary', margin + 16, 352)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Goal Name: ${goalName}`, margin + 16, 374)
    doc.text(`Investment Duration: ${years || 0} years`, margin + 240, 374)
    doc.text(`Monthly SIP: ${formatINR(sip || 0)}`, margin + 16, 392)
    doc.text(`Expected Return: ${expectedReturn}% p.a.`, margin + 240, 392)
    doc.text(`Target Corpus: ${projection ? formatINR(expectedCorpus) : '—'}`, margin + 16, 410)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Risk Profile Explanation', margin, 458)
    doc.setDrawColor(196, 148, 58)
    doc.line(margin, 466, margin + 200, 466)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const riskLines = doc.splitTextToSize(riskProfileExplanation, pageWidth - margin * 2 - 20)
    doc.text(riskLines, margin, 482)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Recommended Mutual Funds', margin, 530)
    doc.setDrawColor(196, 148, 58)
    doc.line(margin, 538, margin + 200, 538)

    const fundRows = monthlyFundAllocation.map((fund) => [
      fund.fund,
      `${fund.percent}%`,
      formatINR(fund.monthlyAmount),
      RECOMMENDATION_REASONS[fund.fund] || 'Diversified long-term allocation'
    ])

    autoTable(doc, {
      startY: 554,
      head: [['Fund Name', 'Allocation %', 'Monthly SIP', 'Reason']],
      body: fundRows,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 7,
        textColor: '#17315d'
      },
      headStyles: {
        fillColor: [10, 21, 48],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 180 },
        1: { cellWidth: 58, halign: 'center' },
        2: { cellWidth: 95 },
        3: { cellWidth: 220 }
      },
      alternateRowStyles: { fillColor: [246, 250, 255] },
      margin: { left: margin, right: margin }
    })

    const tableY = (doc as any).lastAutoTable.finalY + 18

    doc.setFillColor(252, 248, 236)
    doc.roundedRect(margin, tableY, pageWidth - margin * 2, 52, 5, 5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(10, 21, 48)
    doc.setFontSize(11)
    doc.text('Expected Corpus at Retirement', margin + 14, tableY + 18)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${projection ? formatINR(expectedCorpus) : '�'} over ${years || 0} years`, margin + 14, tableY + 36)

    const notesY = tableY + 74
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Advisor Notes', margin, notesY)
    doc.setDrawColor(196, 148, 58)
    doc.line(margin, notesY + 8, margin + 130, notesY + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    ADVISOR_NOTES.forEach((note, index) => {
      doc.circle(margin + 2, notesY + 22 + index * 16, 1.5, 'F')
      doc.text(note, margin + 10, notesY + 24 + index * 16)
    })

    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i += 1) {
      doc.setPage(i)
      addHeader(i, totalPages)
      addFooter(i, totalPages)
    }

    doc.save(`${profile.name || 'client'}-financial-report.pdf`)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
        <p className="text-sm text-navy-700/60">
          Download a polished PDF report for your client or share a print-ready version.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPdf}
            className="rounded-lg bg-gold-600 text-navy-900 px-5 py-2.5 text-sm font-semibold hover:bg-gold-500 transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-navy-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors"
          >
            Print
          </button>
        </div>
      </div>

      <Card className="print-area max-w-6xl mx-auto">
        <div className="flex flex-col gap-3 border-b border-navy-900/10 pb-5 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl text-navy-900">WealthTogether Investments</p>
            <p className="text-xs text-gold-600 uppercase tracking-wide">
              Invest Early. Stay Consistent. Let Time Build Wealth.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-navy-700/50">Personal Financial Planning Report</p>
            <p className="text-xs text-navy-700/50">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Detail label="Prepared by" value="Mohana Kumar T" />
            <Detail label="Designation" value="AMFI Registered Mutual Fund Distributor" />
            <Detail label="Client name" value={profile.name || '—'} />
            <Detail label="Risk profile" value={profile.riskProfile} />
          </div>
        </div>

        {warning && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {warning}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <SummaryCard label="Monthly SIP" value={sip ? formatINR(sip) : '�'} />
          <SummaryCard label="Total Investment" value={formatINR(totalInvested)} />
          <SummaryCard label="Expected Corpus" value={formatINR(expectedCorpus)} />
          <SummaryCard label="Wealth Created" value={formatINR(wealthCreated)} />
          <SummaryCard label="Wealth Multiple" value={wealthMultiple ? `${wealthMultiple.toFixed(2)}x` : '�'} />
        </div>

        <div className="rounded-2xl border border-gold-200 bg-gold-50 p-4 mb-6">
          <p className="text-xs uppercase tracking-wide text-gold-700 mb-2">Goal Summary</p>
          <div className="grid gap-3 md:grid-cols-5 text-sm">
            <Detail label="Goal name" value={goalName} />
            <Detail label="Investment duration" value={`${years || 0} years`} />
            <Detail label="Monthly SIP" value={sip ? formatINR(sip) : '�'} />
            <Detail label="Expected return" value={`${expectedReturn}% p.a.`} />
            <Detail label="Target corpus" value={projection ? formatINR(expectedCorpus) : '—'} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] mb-8">
          <div>
            <h3 className="font-display text-lg text-navy-900 mb-3">Portfolio allocation</h3>
            <div className="h-[360px] rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={120}
                    paddingAngle={4}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gold-700 mb-2">Risk profile</p>
              <p className="font-semibold text-navy-900">{profile.riskProfile}</p>
              <p className="mt-1 text-sm text-navy-700/70">{riskProfileExplanation}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gold-700 mb-2">Advisor notes</p>
              <ul className="space-y-2 text-sm text-navy-700/70">
                {ADVISOR_NOTES.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-600" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-lg text-navy-900 mb-3">Recommended mutual funds</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-900 text-gold-100 text-left">
                  <th className="px-4 py-3 font-medium">Fund Name</th>
                  <th className="px-4 py-3 font-medium">Allocation</th>
                  <th className="px-4 py-3 font-medium">Monthly SIP</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {monthlyFundAllocation.map((fund, i) => (
                  <tr key={fund.fund} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'}>
                    <td className="px-4 py-3 font-medium text-navy-900">{fund.fund}</td>
                    <td className="px-4 py-3 text-navy-700">{fund.percent}%</td>
                    <td className="px-4 py-3 text-navy-700">{formatINR(fund.monthlyAmount)}</td>
                    <td className="px-4 py-3 text-navy-700/75">
                      {RECOMMENDATION_REASONS[fund.fund] || 'Diversified allocation'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-navy-700/50">Total Investment</p>
            <p className="mt-1 text-lg font-semibold text-navy-900">{formatINR(totalInvested)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-navy-700/50">Expected Corpus</p>
            <p className="mt-1 text-lg font-semibold text-navy-900">{formatINR(expectedCorpus)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] uppercase tracking-wide text-navy-700/50">Wealth Created</p>
            <p className="mt-1 text-lg font-semibold text-navy-900">{formatINR(wealthCreated)}</p>
          </div>
        </div>

        {projection ? (
          <>
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-lg text-navy-900">SIP projection</h3>
              <span className="text-sm text-navy-700/60">{years} years @ {expectedReturn}% p.a.</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              <Detail label="Total invested" value={formatINR(projection.totalInvested)} />
              <Detail label="Final corpus" value={formatINR(projection.corpus)} />
              <Detail label="Wealth created" value={formatINR(projection.wealthCreated)} />
            </div>
            <YearlyTable rows={projection.rows} />
          </>
        ) : (
          <p className="text-sm text-navy-700/60 mb-6">
            Add a monthly SIP and duration in the Client Profiler to include a projection.
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-navy-900/10 bg-slate-50 p-4">
          <p className="text-[11px] uppercase tracking-wide text-gold-700">WealthTogether disclaimer</p>
          <p className="mt-1 text-[11px] leading-5 text-navy-700/60">
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future returns.
          </p>
        </div>
      </Card>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-navy-700/50">{label}</p>
      <p className="font-medium text-navy-900">{value}</p>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-navy-700/50">{label}</p>
      <p className="mt-2 text-base font-semibold text-navy-900">{value}</p>
    </div>
  )
}
