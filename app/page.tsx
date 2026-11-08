'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Code2,
  Download,
  FileCheck2,
  FolderKanban,
  GitBranch,
  GitCommitHorizontal,
  Grid2X2,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
} from 'lucide-react'

const navGroups = [
  { label: 'WORKSPACE', items: [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Projects', icon: FolderKanban, count: '12' }, { label: 'Handover Reports', icon: ClipboardCheck, badge: '3 Pending' }, { label: 'Activity', icon: Activity }, { label: 'Evidence Vault', icon: ShieldCheck }] },
  { label: 'TEAM & KNOWLEDGE', items: [{ label: 'Knowledge Gaps', icon: CircleHelp, badge: '4', tone: 'red' }, { label: 'Review Queue', icon: ClipboardCheck }] },
]

const projects = [
  { name: 'ShopStream', area: 'Payment Gateway Migration', status: 'Handover Active', readiness: 84, desc: 'Migrating checkout service from Stripe v2 to multi-PSP routing orchestrator with automated failover and idempotency assurance.', repo: 'github.com/acme/shopstream-payments', branch: 'main (7f3a9c1)', owner: 'Marcus Chen', successor: 'Dev Patel', meta: '12m ago by @m_chen (PR #402)', blockers: '1 Critical Blocker', color: 'orange' },
  { name: 'AuthMatrix', area: 'OAuth2 & Passkey Provider', status: 'Awaiting Sign-off', readiness: 96, desc: 'Core identity engine refactor to FIDO2 WebAuthn with biometric fallback and hardware key enforcement.', repo: 'github.com/acme/auth-matrix', branch: 'release/v3.0', owner: 'Karin Lindqvist', successor: 'Alex Rivera', meta: '1h ago by @k_lindqvist', blockers: '0 Blockers', color: 'indigo' },
  { name: 'DataPipeline', area: 'Real-time CDC Sync', status: 'Drafting Handover', readiness: 71, desc: 'Debezium-to-ClickHouse streaming connector for high-throughput user audit events and distributed tracing.', repo: 'github.com/acme/event-bus', branch: 'main', owner: 'T. Moreau', successor: 'Unassigned', meta: '3h ago by @t_moreau', blockers: '3 Knowledge Gaps', color: 'gray' },
]

const stream = [
  ['COMMIT / PR', '@m_chen merged PR #402', '“Add idempotent dispatcher” with 3 verified architectural decisions attached.', '12m ago', 'verified'],
  ['ADR RECORDED', 'ADR-042: Adopt ChaCha20-Poly1305', 'Payment token encryption confirmed in docs/adr/0042.md.', '44m ago', 'deduction'],
  ['GAP DETECTED', 'Relay AST scanner flagged missing secret rotation', 'steps in staging/deploy.sh runbook.', '2h ago', 'gap'],
  ['CONFLICT DETECTED', 'ADR-038 cites Redis v6 client', 'while Helm chart specifies Redis v7.2 cluster topology.', '4h ago', 'conflict'],
  ['DOSSIER SIGN-OFF', '@alex_r approved Handover Module', '“Session Lifecycle Hardening” (100% hash verified).', 'Yesterday', 'verified'],
]

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{children}</span>
}

function Sidebar({ active, setActive, open, onClose }: { active: string; setActive: (v: string) => void; open: boolean; onClose: () => void }) {
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="brand-row"><div className="relay-mark">⌁</div><strong>Relay</strong><span className="pro-tag">PRO</span><button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close navigation"><X size={16} /></button></div>
    <div className="org-switcher"><div className="org-icon"><BuildingIcon /></div><div><strong>Relay Engineering</strong><small>42 repos linked</small></div><ChevronDown size={15} /></div>
    <div className="nav-scroll">{navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map((item) => { const Icon = item.icon; return <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => { setActive(item.label); onClose() }}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.count && <span className="count">{item.count}</span>}{item.badge && <span className={`nav-badge ${item.tone === 'red' ? 'red' : ''}`}>{item.badge}</span>}{active === item.label && <span className="active-dot" />}</button> })}</div>)}</div>
    <div className="sidebar-bottom"><button className="nav-item"><Settings size={17} /><span>Settings</span></button><button className="nav-item"><BookOpen size={17} /><span>Documentation / API</span></button><div className="profile"><div className="avatar">ER</div><div><strong>Elena Rostova</strong><small>Staff Architect</small></div><span className="online"><i />Online</span></div></div>
  </aside>
}

function BuildingIcon() { return <span className="building-icon">▦</span> }

function StatCard({ title, value, suffix, note, tone, children }: { title: string; value: string; suffix?: string; note: string; tone?: string; children?: React.ReactNode }) {
  return <div className="stat-card"><div className="stat-head"><span>{title}</span><Badge tone={tone}>{tone === 'danger' ? 'Action Required' : tone === 'verified' ? 'Git Verified' : 'ShopStream Leading'}</Badge></div><div className={`stat-value ${tone || ''}`}>{value}<small>{suffix}</small>{children}</div><div className="stat-note">{note}</div></div>
}

function ProjectCard({ project, onReview }: { project: typeof projects[number]; onReview: () => void }) {
  return <article className="project-card"><div className="project-top"><div><h3>{project.name} <span>/ {project.area}</span></h3><Badge tone={project.color}>{project.status}</Badge></div><div className="readiness"><span>READINESS</span><strong className={project.readiness < 80 ? 'warn' : ''}>{project.readiness}%</strong></div></div><p className="project-desc">{project.desc}</p>{project.name === 'ShopStream' && <div className="project-progress"><div className="progress-meta"><span>HANDOVER READINESS&nbsp; <b>84%</b> <em>(Target: 95% for sign-off)</em></span><span className="critical">◉&nbsp; 1 Critical Blocker: Stripe Webhook replay spec missing</span></div><div className="progress-track"><i style={{ width: `${project.readiness}%` }} /></div><div className="project-stats"><span><ShieldCheck size={14} />14 Architectural Decisions</span><span><GitCommitHorizontal size={14} />42 Merged PRs</span><span className="critical"><FileCheck2 size={14} />3 Runbook Gaps</span><span>Milestone: 3 of 4 signed</span></div></div>}<div className="project-foot"><div className="repo"><Code2 size={14} />{project.repo} <span>{project.branch}</span></div><div className="people">Departing: <b>{project.owner}</b> → Onboarding: <b className="blue">{project.successor}</b></div></div><div className="card-actions"><span><Activity size={14} />{project.meta}</span><button className="ghost-btn" onClick={onReview}>{project.name === 'ShopStream' ? 'Review Handover Dossier' : 'Review Dossier'} <ChevronRight size={15} /></button></div></article>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [tab, setTab] = useState('All Projects')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState('')
  const filtered = useMemo(() => tab === 'Assigned to Me' ? projects.filter((p) => p.name !== 'DataPipeline') : tab === 'Needs Review' ? projects.filter((p) => p.name === 'ShopStream') : projects, [tab])
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><main className="main"><header className="topbar"><button className="icon-btn menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Relay Engineering</span><ChevronRight size={13} /><span>Handover Hub</span><ChevronRight size={13} /><b>{active}</b></div><div className="top-actions"><button className="search"><Search size={17} /><span>Search projects, handovers, commits, or evidence</span><kbd>⌘K</kbd></button><button className="icon-btn"><Bell size={18} /><i className="notification-dot" /></button><button className="export" onClick={() => notify('Audit log export queued')}><Download size={16} />Export Audit Log</button><button className="primary-btn" onClick={() => notify('New handover draft started')}><Plus size={16} />Create Project <kbd>C</kbd></button><div className="mini-avatar">ER</div></div></header><div className="content"><div className="welcome"><div><h1>Good morning, Elena. <span>Here&apos;s your workspace.</span></h1><p><span className="sync-dot" /> Connected to GitHub • Last repository sync 4m ago</p><div className="subline">Elena Rostova <span>•</span> <b>1 urgent transition handover</b> requires review before sprint completion.</div></div><div className="welcome-actions"><div className="tabs">{['All Projects', 'Assigned to Me', 'Needs Review'].map((item) => <button key={item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)}>{item}{item === 'Needs Review' && <sup>1</sup>}</button>)}</div><button className="secondary-btn" onClick={() => notify('Handover draft opened')}><ClipboardCheck size={16} />New Handover Draft</button></div></div><section className="stats-grid"><StatCard title="HANDOVER READINESS" value="84%" suffix="/ target 95%" note="1 critical blocker remaining" tone="verified" /><StatCard title="UNRESOLVED BLOCKERS" value="1" suffix="Critical (+2 Warnings)" note="Stripe Webhook replay spec missing" tone="danger" /><StatCard title="VERIFIED EVIDENCE ITEMS" value="1,832" suffix="tracked artifacts" note="Across 3 active transitions" tone="verified" /></section><section className="trust-panel"><div className="trust-header"><div className="trust-title"><div className="shield-box"><ShieldCheck size={20} /></div><div><h2>Knowledge Readiness &amp; Trust Classification <Badge>GLOBAL AUDIT</Badge></h2><p>Evidence backing handovers across active engineering transitions</p></div></div><div className="global-readiness"><span>GLOBAL HANDOVER READINESS</span><strong>88.5%</strong></div><button className="secondary-btn" onClick={() => notify('Evidence vault opened')}><ShieldCheck size={15} />Inspect Evidence Vault</button></div><div className="trust-bar"><i /><i /><i /><i /></div><div className="trust-legend"><div><b className="green">● &nbsp;Verified Facts</b><strong>68%</strong><span>1,245 proofs</span><small>Commits, PR merges, codebase AST diffs...</small></div><div><b className="indigo">● &nbsp;AI Deductions</b><strong>20%</strong><span>368 inferences</span><small>Synthesized decisions &amp; call-graph traces</small></div><div><b className="orange">● &nbsp;Unresolved Conflicts</b><strong>8%</strong><span>14 items</span><small>Discrepancies between ADR docs &amp; code</small></div><div><b className="pink">● &nbsp;Information Gaps</b><strong>4%</strong><span>8 items</span><small>Unmapped env variables &amp; missing runbooks</small></div></div></section><div className="section-heading"><h2>Active Monitored Projects <Badge>3 Transitions In-Flight</Badge></h2><button className="link-btn" onClick={() => setTab('All Projects')}>View all projects <ChevronRight size={16} /></button></div><section className="lower-grid"><div className="project-list">{filtered.map((p) => <ProjectCard key={p.name} project={p} onReview={() => notify(`${p.name} dossier opened`)} />)}{filtered.length === 0 && <div className="empty-state">No projects match this view.</div>}</div><aside className="audit-stream"><div className="section-heading"><h2>Audit Stream</h2><span>LIVE TELEMETRY</span></div><div className="stream-card">{stream.map(([label, title, body, time, tone]) => <button className="stream-item" key={title} onClick={() => notify(`${title} selected`)}><div><Badge tone={tone}>{label}</Badge><time>{time}</time></div><strong>{title}</strong><p>{body}</p></button>)}</div><div className="freeze-card"><div>94%</div><span><b>Sprint Freeze Gate</b><small>All artifacts locked on Friday</small></span><LockKeyhole size={20} /></div></aside></section><div className="section-heading roster-heading"><h2>Active Handover Roster <Badge>Sprint 24.4</Badge></h2><span>3 ACTIVE DOSSIERS</span></div><section className="roster"><div className="roster-head"><span>HANDOVER CONTEXT</span><span>TRANSITION OWNERSHIP</span><span>STATUS</span><span>EVIDENCE AUDIT</span><span>TIMESTAMP</span><span>ACTION</span></div>{[['Payment Gateway Migration','ShopStream Payments','Marcus Chen → Dev Patel','Under Review','142 tracked proofs','Today, 09:30 AM'],['Auth Engine FIDO2','AuthMatrix Provider','Karin Lindqvist → Alex Rivera','Awaiting Sign-off','89 tracked proofs','Yesterday, 4:15 PM'],['Billing Microservices v2','CoreBilling Systems','Sarah Jenkins → David Kim','Drafting','210 tracked proofs','Oct 24, 2024']].map((row) => <div className="roster-row" key={row[0]}><div><b>{row[0]}</b><small>{row[1]}</small></div><span>{row[2]}</span><Badge tone={row[3] === 'Under Review' ? 'orange' : row[3] === 'Awaiting Sign-off' ? 'indigo' : 'neutral'}>{row[3]}</Badge><span>{row[4]}</span><time>{row[5]}</time><button className="small-btn" onClick={() => notify(`${row[0]} dossier opened`)}>{row[3] === 'Under Review' ? 'Review & Verify' : 'View Dossier'}</button></div>)}</section></div></main>{toast && <div className="toast"><Check size={15} />{toast}</div>}</div>
}
