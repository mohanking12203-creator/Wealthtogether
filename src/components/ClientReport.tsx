import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ClientProfile } from '../types'
import { PORTFOLIOS } from '../data/funds'
import { sipProjection, formatINR } from '../utils/calculations'
import { Card, SectionTitle, YearlyTable } from './ui'

const COLORS = ['#0a1530', '#c4943a', '#2c4f9e', '#d9ad4a', '#162a5c']
const RECOMMENDATION_REASONS: Record<string, string> = {
  'HDFC Flexi Cap': 'Core portfolio stability',
  'ICICI Large & Mid Cap': 'Growth-oriented diversification',
  'SBI Contra': 'Contrarian long-term opportunity'
}

export function ClientReport({ profile }: { profile: ClientProfile }) {
  const sip = Number(profile.monthlySip) || 0
  const years = Number(profile.durationYears) || 0
  const allocation = PORTFOLIOS[profile.riskProfile]
  const projection = useMemo(
    () => (sip > 0 && years > 0 ? sipProjection(sip, 12, years) : null),
    [sip, years]
  )

  const pieData = allocation.map((a) => ({ name: a.fund, value: a.percent }))
  const expectedCorpus = projection?.corpus ?? 0
  const totalInvested = projection?.totalInvested ?? 0
  const wealthCreated = projection?.wealthCreated ?? 0
  const wealthMultiple = totalInvested > 0 ? expectedCorpus / totalInvested : 0
  const goalName = profile.name ? `${profile.name.split(' ')[0]}'s Wealth Goal` : 'Personal Wealth Goal'

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

    const cardWidth = (pageWidth - margin * 2 - 16) / 5
    const summaryY = 240
    const summaryCards = [
      { label: 'Monthly SIP', value: formatINR(sip || 0) },
      { label: 'Total Investment', value: formatINR(totalInvested) },
      { label: 'Expected Corpus', value: formatINR(expectedCorpus) },
      { label: 'Wealth Created', value: formatINR(wealthCreated) },
      { label: 'Wealth Multiple', value: wealthMultiple.toFixed(2) + 'x' }
    ]

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
    doc.text(`Expected Return: 12% p.a.`, margin + 240, 392)
    doc.text(`Target Corpus: ${projection ? formatINR(expectedCorpus) : '—'}`, margin + 16, 410)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Portfolio Recommendation', margin, 458)
    doc.setDrawColor(196, 148, 58)
    doc.line(margin, 466, margin + 180, 466)

    const fundRows = allocation.map((fund) => [
      fund.fund,
      `${fund.percent}%`,
      RECOMMENDATION_REASONS[fund.fund] || 'Diversified long-term allocation'
    ])

    autoTable(doc, {
      startY: 482,
      head: [['Fund Name', 'Allocation %', 'Reason']],
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
        0: { cellWidth: 220 },
        1: { cellWidth: 72, halign: 'center' },
        2: { cellWidth: 240 }
      },
      alternateRowStyles: { fillColor: [246, 250, 255] },
      margin: { left: margin, right: margin }
    })

    const tableY = (doc as any).lastAutoTable.finalY + 18

    if (projection) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('SIP Projection', margin, tableY)
      doc.setDrawColor(196, 148, 58)
      doc.line(margin, tableY + 8, margin + 145, tableY + 8)

      autoTable(doc, {
        startY: tableY + 18,
        head: [['Year', 'Invested', 'Corpus', 'Wealth Created']],
        body: projection.rows.map((row) => [
          `${row.year}`,
          formatINR(row.invested),
          formatINR(row.value),
          formatINR(row.profit)
        ]),
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 6,
          textColor: '#17315d'
        },
        headStyles: {
          fillColor: [10, 21, 48],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 65, halign: 'center' },
          1: { cellWidth: 140 },
          2: { cellWidth: 140 },
          3: { cellWidth: 140 }
        },
        alternateRowStyles: { fillColor: [246, 250, 255] },
        margin: { left: margin, right: margin }
      })
    }

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

      <Card className="print-area max-w-5xl mx-auto">
        <div className="flex items-center justify-between border-b border-navy-900/10 pb-4 mb-6">
          <div>
            <p className="font-display text-xl text-navy-900">WealthTogether Investments</p>
            <p className="text-xs text-gold-600 uppercase tracking-wide">
              Invest Early. Stay Consistent. Let Time Build Wealth.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-navy-700/50">Personal Financial Planning Report</p>
            <p className="text-xs text-navy-700/50">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Prepared by" value="Mohana Kumar T" />
            <Detail label="Designation" value="AMFI Registered Mutual Fund Distributor" />
            <Detail label="Client name" value={profile.name || '—'} />
            <Detail label="Risk profile" value={profile.riskProfile} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <SummaryCard label="Monthly SIP" value={sip ? formatINR(sip) : '—'} />
          <SummaryCard label="Total Investment" value={formatINR(totalInvested)} />
          <SummaryCard label="Expected Corpus" value={formatINR(expectedCorpus)} />
          <SummaryCard label="Wealth Created" value={formatINR(wealthCreated)} />
          <SummaryCard label="Wealth Multiple" value={wealthMultiple ? `${wealthMultiple.toFixed(2)}x` : '—'} />
        </div>

        <div className="rounded-xl border border-gold-200 bg-gold-50 p-4 mb-6">
          <p className="text-xs uppercase tracking-wide text-gold-700 mb-2">Goal Summary</p>
          <div className="grid md:grid-cols-5 gap-3 text-sm">
            <Detail label="Goal name" value={goalName} />
            <Detail label="Investment duration" value={`${years || 0} years`} />
            <Detail label="Monthly SIP" value={sip ? formatINR(sip) : '—'} />
            <Detail label="Expected return" value="12% p.a." />
            <Detail label="Target corpus" value={projection ? formatINR(expectedCorpus) : '—'} />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-lg text-navy-900 mb-3">Portfolio allocation</h3>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
            <div className="h-[340px] rounded-xl bg-slate-50 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={64}
                    outerRadius={110}
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
            <div className="space-y-3">
              {allocation.map((a, i) => (
                <div
                  key={a.fund}
                  className="rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <div>
                      <p className="font-medium text-navy-900">{a.fund}</p>
                      <p className="text-xs text-navy-700/60">
                        {RECOMMENDATION_REASONS[a.fund] || 'Diversified allocation'}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-navy-900">{a.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-display text-lg text-navy-900 mb-3">Portfolio recommendation</h3>
          <div className="space-y-3">
            {allocation.map((a, i) => (
              <div key={a.fund} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-navy-900">{a.fund}</p>
                    <p className="text-sm text-navy-700/60">
                      {RECOMMENDATION_REASONS[a.fund] || 'Diversified allocation'}
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-navy-900">
                    {a.percent}% allocation
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {projection ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-lg text-navy-900">SIP projection</h3>
              <span className="text-sm text-navy-700/60">{years} years @ 12% p.a.</span>
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

        <p className="text-[11px] text-navy-700/50 mt-8 border-t border-navy-900/10 pt-4 leading-relaxed">
          Disclaimer: Mutual fund investments are subject to market risks. Read all scheme-related
          documents carefully before investing.
        </p>
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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-navy-700/50">{label}</p>
      <p className="mt-2 text-base font-semibold text-navy-900">{value}</p>
    </div>
  )
}
