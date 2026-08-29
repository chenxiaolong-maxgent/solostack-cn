'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  BarChart3,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  FilePenLine,
  FileText,
  Gauge,
  MessageSquareText,
  MessageSquareQuote,
  PackageCheck,
  Radar,
  ReceiptText,
  Repeat2,
  Send,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CatalogType = 'free' | 'product' | 'service';
type CatalogItem = { name: string; type: CatalogType; price: string; description: string; href: string; icon: LucideIcon; featured?: boolean };

const PROBLEMS = [
  { key: 'price', label: '不会报价', icon: BadgeDollarSign, tool: '报价底线 RateFloor', note: '先算出可持续时薪、日费率和项目底价，再决定报多少。', href: 'https://chenxiaolong-maxgent.github.io/ratefloor/', action: '免费算报价底线', paid: '报价诊断', price: '¥199', paidHref: 'https://github.com/chenxiaolong-maxgent/ratefloor/issues/1' },
  { key: 'scope', label: '客户总加需求', icon: FilePenLine, tool: 'ScopeGuard', note: '把临时需求整理成能确认、能加价的结构化变更单。', href: 'https://chenxiaolong-maxgent.github.io/scopeguard/', action: '免费生成变更单', paid: '三行业变更单模板', price: '¥19', paidHref: 'https://github.com/chenxiaolong-maxgent/scopeguard/issues/1' },
  { key: 'kickoff', label: '开工前一团乱', icon: ClipboardCheck, tool: 'KickoffFlow', note: '把资料、账号、启动会议、角色权限和首周动作一次对齐，减少开工后的反复追问。', href: 'https://chenxiaolong-maxgent.github.io/kickoffflow-cn/', action: '免费生成启动包', paid: '项目启动包定制', price: '¥99', paidHref: 'https://github.com/chenxiaolong-maxgent/kickoffflow-cn/issues/new?template=kickoff-pack-service.yml&title=%E7%94%B3%E8%AF%B7%20%E9%A1%B9%E7%9B%AE%E5%90%AF%E5%8A%A8%E5%8C%85%E5%AE%9A%E5%88%B6' },
  { key: 'signoff', label: '交付后没确认', icon: BadgeCheck, tool: '验收通 SignoffFlow', note: '把交付清单、反馈截止日、验收确认、尾款节点和权限回收一次写清，减少项目结束后的无限等待。', href: 'https://chenxiaolong-maxgent.github.io/signoffflow-cn/', action: '免费生成验收包', paid: '项目收尾包定制', price: '¥99 起', paidHref: 'https://github.com/chenxiaolong-maxgent/signoffflow-cn/issues/new?template=closeout-service.yml&title=%E7%94%B3%E8%AF%B7%20%E9%A1%B9%E7%9B%AE%E6%94%B6%E5%B0%BE%E5%8C%85%E5%AE%9A%E5%88%B6' },
  { key: 'risk', label: '怕遇到烂客户', icon: Radar, tool: '客户雷达 ClientRisk', note: '用 9 个事实信号，提前判断身份、范围、启动款和账期风险。', href: 'https://chenxiaolong-maxgent.github.io/clientrisk/', action: '免费检查客户风险', paid: '客户筛选诊断', price: '¥99', paidHref: 'https://github.com/chenxiaolong-maxgent/clientrisk/issues/1' },
  { key: 'collect', label: '钱收不回来', icon: CircleDollarSign, tool: '催款回声 PayPing', note: '生成提醒、推进、边界通知三步催款序列，支持中英双语。', href: 'https://chenxiaolong-maxgent.github.io/payping/', action: '免费生成催款话术', paid: '个性化催款方案', price: '¥49', paidHref: 'https://github.com/chenxiaolong-maxgent/payping/issues/1' },
  { key: 'retainer', label: '月费方案不会定', icon: Repeat2, tool: 'RetainerFit', note: '反推月目标营收、时薪底线和客户容量，再生成维护、标准、增长三档月费方案。', href: 'https://chenxiaolong-maxgent.github.io/retainerfit-cn/', action: '免费设计月费方案', paid: '月费成交模板包', price: '¥39', paidHref: 'https://github.com/chenxiaolong-maxgent/retainerfit-cn/issues/new?template=buy-retainerfit-pro.yml&title=%E8%B4%AD%E4%B9%B0%20RetainerFit%20PRO' },
  { key: 'followup', label: '报价后没回复', icon: Send, tool: 'DealNudge', note: '识别客户信号，生成今天、+2 天、+4 天、+7 天四步跟进节奏，不乱催也不无限等待。', href: 'https://chenxiaolong-maxgent.github.io/dealnudge-cn/', action: '免费生成跟进话术', paid: '成交跟进方案', price: '¥59', paidHref: 'https://github.com/chenxiaolong-maxgent/dealnudge-cn/issues/new?template=deal-followup.yml&title=%E7%94%B3%E8%AF%B7%20%E6%88%90%E4%BA%A4%E8%B7%9F%E8%BF%9B%E6%96%B9%E6%A1%88' },
  { key: 'proof', label: '项目做完没口碑', icon: MessageSquareQuote, tool: 'ProofLoop', note: '根据项目结果、请求类型和公开方式，生成评价、案例或转介绍三步请求，并保留授权边界。', href: 'https://chenxiaolong-maxgent.github.io/proofloop-cn/', action: '免费生成口碑请求', paid: '客户口碑模板包', price: '¥29', paidHref: 'https://github.com/chenxiaolong-maxgent/proofloop-cn/issues/new?template=buy-proofloop-pro.yml&title=%E8%B4%AD%E4%B9%B0%20ProofLoop%20PRO' },
  { key: 'profit', label: '不知道赚没赚', icon: WalletCards, tool: 'ProfitLens PRO', note: '把费率、直接成本、实际工时和免费加需求一起算进去，找出真正赚钱的项目。', href: 'https://chenxiaolong-maxgent.github.io/profitlens-pro-cn/', action: '查看真实表格', paid: '项目利润跟踪表', price: '¥29', paidHref: 'https://github.com/chenxiaolong-maxgent/profitlens-pro-cn/issues/new?template=buy-profitlens.yml&title=%E8%B4%AD%E4%B9%B0%20ProfitLens%20PRO' },
] as const;

const CATALOG: CatalogItem[] = [
  { name: '报价匠 OfferFlow', type: 'free' as const, price: '免费', description: '中英双语报价单生成、本地保存、多币种与 PDF。', href: 'https://chenxiaolong-maxgent.github.io/offerflow/', icon: ReceiptText },
  { name: 'ScopeGuard', type: 'free' as const, price: '免费', description: '把客户临时加需求变成可确认、可加价的变更单。', href: 'https://chenxiaolong-maxgent.github.io/scopeguard/', icon: FilePenLine },
  { name: 'KickoffFlow', type: 'free' as const, price: '免费', description: '生成启动会议、资料与权限清单、角色分工和首周推进计划。', href: 'https://chenxiaolong-maxgent.github.io/kickoffflow-cn/', icon: ClipboardCheck },
  { name: '验收通 SignoffFlow', type: 'free' as const, price: '免费', description: '生成交付清单、验收确认、尾款提醒、客户消息和项目归档清单。', href: 'https://chenxiaolong-maxgent.github.io/signoffflow-cn/', icon: BadgeCheck },
  { name: '报价底线 RateFloor', type: 'free' as const, price: '免费', description: '计算可持续时薪、日费率、项目底价与建议区间。', href: 'https://chenxiaolong-maxgent.github.io/ratefloor/', icon: Gauge },
  { name: 'RetainerFit', type: 'free' as const, price: '免费', description: '反推目标营收、客户容量与维护、标准、增长三档月费方案。', href: 'https://chenxiaolong-maxgent.github.io/retainerfit-cn/', icon: Repeat2 },
  { name: '客户雷达 ClientRisk', type: 'free' as const, price: '免费', description: '用 9 个事实信号检查客户、付款与范围风险。', href: 'https://chenxiaolong-maxgent.github.io/clientrisk/', icon: Radar },
  { name: '催款回声 PayPing', type: 'free' as const, price: '免费', description: '生成中英双语三步催款序列，支持消息和邮件。', href: 'https://chenxiaolong-maxgent.github.io/payping/', icon: MessageSquareText },
  { name: 'DealNudge', type: 'free' as const, price: '免费', description: '按客户信号生成有价值、有退出边界的四步报价跟进话术。', href: 'https://chenxiaolong-maxgent.github.io/dealnudge-cn/', icon: Send },
  { name: 'ProofLoop', type: 'free' as const, price: '免费', description: '生成客户评价、案例访谈或转介绍三步请求，并记录公开授权。', href: 'https://chenxiaolong-maxgent.github.io/proofloop-cn/', icon: MessageSquareQuote },
  { name: '报价匠 PRO', type: 'product' as const, price: '¥29', description: '6 个行业的可编辑 Word 报价模板。', href: 'https://github.com/chenxiaolong-maxgent/offerflow/issues/1', icon: FileText },
  { name: 'ScopeGuard PRO', type: 'product' as const, price: '¥19', description: '设计、网站、顾问三行业需求变更单模板。', href: 'https://github.com/chenxiaolong-maxgent/scopeguard/issues/1', icon: FilePenLine },
  { name: 'KickoffFlow PRO', type: 'product' as const, price: '¥29', description: '3 份 Word 客户启动、资料、会议、角色权限与首周推进模板。', href: 'https://github.com/chenxiaolong-maxgent/kickoffflow-cn/issues/new?template=buy-kickoffflow-pro.yml&title=%E8%B4%AD%E4%B9%B0%20KickoffFlow%20PRO', icon: ClipboardCheck },
  { name: 'SignoffFlow PRO', type: 'product' as const, price: '¥29', description: '3 份 Word 项目交付、验收、尾款推进、权限移交与归档模板。', href: 'https://github.com/chenxiaolong-maxgent/signoffflow-cn/issues/new?template=buy-signoffflow-pro.yml&title=%E8%B4%AD%E4%B9%B0%20SignoffFlow%20PRO', icon: BadgeCheck },
  { name: 'ProfitLens PRO', type: 'product' as const, price: '¥29', description: 'Excel 项目利润、有效时薪与免费加需求跟踪系统。', href: 'https://chenxiaolong-maxgent.github.io/profitlens-pro-cn/', icon: WalletCards },
  { name: 'CashRadar PRO', type: 'product' as const, price: '¥29', description: 'Excel 回款仪表盘、应收台账与 12 套催款话术。', href: 'https://github.com/chenxiaolong-maxgent/offerflow/issues/2', icon: BarChart3 },
  { name: 'RetainerFit PRO', type: 'product' as const, price: '¥39', description: '3 份 Word 月费提案、范围管理、复盘与续费沟通模板。', href: 'https://github.com/chenxiaolong-maxgent/retainerfit-cn/issues/new?template=buy-retainerfit-pro.yml&title=%E8%B4%AD%E4%B9%B0%20RetainerFit%20PRO', icon: Repeat2 },
  { name: 'ProofLoop PRO', type: 'product' as const, price: '¥29', description: '3 份 Word 客户评价、案例访谈、转介绍与授权模板。', href: 'https://github.com/chenxiaolong-maxgent/proofloop-cn/issues/new?template=buy-proofloop-pro.yml&title=%E8%B4%AD%E4%B9%B0%20ProofLoop%20PRO', icon: MessageSquareQuote },
  { name: '接单经营全家桶', type: 'product' as const, price: '¥69', description: '21 份 Word、2 套 Excel 与完整项目经营工作流。', href: 'https://github.com/chenxiaolong-maxgent/freelance-ops-kit/issues/1', icon: PackageCheck, featured: true },
  { name: '报价诊断', type: 'service' as const, price: '¥199', description: '报价问题清单、三档结构、客户解释话术与一次修订。', href: 'https://github.com/chenxiaolong-maxgent/ratefloor/issues/1', icon: BadgeDollarSign },
  { name: '客户筛选诊断', type: 'service' as const, price: '¥99', description: '最低接单条件、付款保护与核验或拒绝话术。', href: 'https://github.com/chenxiaolong-maxgent/clientrisk/issues/1', icon: ShieldCheck },
  { name: '个性化催款方案', type: 'service' as const, price: '¥49', description: '7 天推进节奏、3 组定制话术与边界建议。', href: 'https://github.com/chenxiaolong-maxgent/payping/issues/1', icon: CircleDollarSign },
  { name: '月费方案诊断', type: 'service' as const, price: '¥299', description: '经营诊断、三档月费范围表、变更规则与销售续费话术。', href: 'https://github.com/chenxiaolong-maxgent/retainerfit-cn/issues/new?template=retainer-diagnosis.yml&title=%E7%94%B3%E8%AF%B7%20%E6%9C%88%E8%B4%B9%E6%96%B9%E6%A1%88%E8%AF%8A%E6%96%AD', icon: Repeat2 },
  { name: '成交跟进方案', type: 'service' as const, price: '¥59', description: '客户信号判断、四步发送节奏、定制话术与异议回复。', href: 'https://github.com/chenxiaolong-maxgent/dealnudge-cn/issues/new?template=deal-followup.yml&title=%E7%94%B3%E8%AF%B7%20%E6%88%90%E4%BA%A4%E8%B7%9F%E8%BF%9B%E6%96%B9%E6%A1%88', icon: Send },
  { name: '项目启动包定制', type: 'service' as const, price: '¥99 起', description: '按项目类型定制资料清单、启动议程、角色权限和首周推进表。', href: 'https://github.com/chenxiaolong-maxgent/kickoffflow-cn/issues/new?template=kickoff-pack-service.yml&title=%E7%94%B3%E8%AF%B7%20%E9%A1%B9%E7%9B%AE%E5%90%AF%E5%8A%A8%E5%8C%85%E5%AE%9A%E5%88%B6', icon: ClipboardCheck },
  { name: '项目收尾包定制', type: 'service' as const, price: '¥99 起', description: '按真实项目定制交付清单、验收口径、尾款消息、权限移交与归档结构。', href: 'https://github.com/chenxiaolong-maxgent/signoffflow-cn/issues/new?template=closeout-service.yml&title=%E7%94%B3%E8%AF%B7%20%E9%A1%B9%E7%9B%AE%E6%94%B6%E5%B0%BE%E5%8C%85%E5%AE%9A%E5%88%B6', icon: BadgeCheck },
];

const FILTERS: { key: 'all' | CatalogType; label: string }[] = [
  { key: 'all', label: '全部 26 项' },
  { key: 'free', label: '免费工具' },
  { key: 'product', label: '成品商品' },
  { key: 'service', label: '产品化服务' },
];

const TYPE_LABEL: Record<CatalogType, string> = { free: '免费工具', product: '成品商品', service: '产品化服务' };

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<'all' | CatalogType>('all');
  const current = PROBLEMS[selected];
  const CurrentIcon = current.icon;
  const visible = useMemo(() => filter === 'all' ? CATALOG : CATALOG.filter((item) => item.type === filter), [filter]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <a href="#start" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(72,45,142,0.18)]"><Sparkles className="size-4.5" /></span><span>SoloStack <span className="font-normal text-muted-foreground">独立接单工具箱</span></span></a>
          <a href="https://github.com/chenxiaolong-maxgent/freelance-ops-kit/issues/1" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:text-primary sm:flex"><PackageCheck className="size-3.5 text-primary" /> 全家桶早鸟 ¥69</a>
        </div>
      </header>

      <section id="start" className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.93fr_1.07fr] lg:items-end">
          <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Freelance operating stack</p><h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">别再到处找模板。<br />先说你卡在哪里。</h1><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">从第一次报价、客户启动到正式验收、回款与客户口碑，按当前问题进入最短解决路径。所有免费工具无需登录。</p><div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground"><span><strong className="text-foreground">10</strong> 个免费工具</span><span><strong className="text-foreground">9</strong> 个成品商品</span><span><strong className="text-foreground">7</strong> 项产品化服务</span></div></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PROBLEMS.map((problem, index) => { const Icon = problem.icon; return <button type="button" key={problem.key} onClick={() => setSelected(index)} className={`flex min-h-24 flex-col justify-between rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selected === index ? 'border-primary bg-primary text-primary-foreground shadow-lg' : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary/35'}`}><Icon className="size-4" /><span className="mt-5 text-sm font-semibold">{problem.label}</span></button>; })}
          </div>
        </div>

        <div className="solo-grid mt-8 overflow-hidden rounded-[30px] bg-[#20213a] p-5 text-[#fbf7e9] shadow-[0_28px_80px_rgba(32,33,58,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#f1e45e] text-[#20213a]"><CurrentIcon className="size-6" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#aeb3d8]">你的下一步</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{current.tool}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#c7cae3]">{current.note}</p></div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col"><a href={current.href} target={current.href.startsWith('#') ? undefined : '_blank'} rel={current.href.startsWith('#') ? undefined : 'noreferrer'} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#f1e45e] px-5 text-sm font-semibold text-[#20213a] transition hover:bg-[#fff587]">{current.action}<ArrowRight className="size-4" /></a><a href={current.paidHref} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-semibold text-white transition hover:bg-white/10">{current.paid} · {current.price}</a></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#ebe9dc] px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div aria-hidden="true" style={{ backgroundImage: "url('og.png')" }} className="aspect-[1200/630] rounded-[28px] bg-[#20213a] bg-cover bg-center shadow-[0_28px_70px_rgba(32,33,58,0.16)]" />
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">One operating path</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">免费解决眼前问题，系统解决反复问题。</h2><p className="mt-5 text-base leading-7 text-muted-foreground">只遇到一次卡点，先用免费工具；如果同类问题反复发生，直接使用成品模板或完整经营系统。没有订阅，也不需要先买才能试。</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{['先算底线，再发报价', '先对齐启动，再开始交付', '先写范围，再接受变更', '先写验收，再关闭项目', '先管应收，再追收入', '先问口碑，再做传播'].map((item) => <div key={item} className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-primary" />{item}</div>)}</div></div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Catalog</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">全部工具与服务</h2><p className="mt-3 text-sm text-muted-foreground">价格按当前早鸟入口展示；公开登记不会自动扣款。</p></div><div className="flex flex-wrap gap-2">{FILTERS.map((item) => <button type="button" key={item.key} onClick={() => setFilter(item.key)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${filter === item.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/30'}`}>{item.label}</button>)}</div></div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => { const Icon = item.icon; return <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className={`group flex min-h-56 flex-col rounded-[24px] border p-6 transition hover:-translate-y-1 hover:shadow-xl ${item.featured ? 'border-[#20213a] bg-[#20213a] text-[#fbf7e9]' : 'border-border bg-card'}`}><div className="flex items-start justify-between gap-4"><span className={`grid size-11 place-items-center rounded-2xl ${item.featured ? 'bg-[#f1e45e] text-[#20213a]' : 'bg-secondary text-primary'}`}><Icon className="size-5" /></span><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.featured ? 'bg-white/10 text-[#f1e45e]' : 'bg-muted text-foreground'}`}>{item.price}</span></div><p className={`mt-6 text-[10px] font-bold uppercase tracking-[0.16em] ${item.featured ? 'text-[#aeb3d8]' : 'text-primary'}`}>{TYPE_LABEL[item.type]}</p><h3 className="mt-2 text-lg font-semibold">{item.name}</h3><p className={`mt-2 text-sm leading-6 ${item.featured ? 'text-[#c7cae3]' : 'text-muted-foreground'}`}>{item.description}</p><span className={`mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold ${item.featured ? 'text-[#f1e45e]' : 'text-primary'}`}>打开入口 <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span></a>; })}
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-[1280px] rounded-[32px] bg-primary p-7 text-primary-foreground sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/65">Best value</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">不想自己拼？¥69 一套直接开始。</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/75">包含 21 份 Word 模板、完整 Excel 利润与回款系统、客户启动、交付验收、催款与口碑话术、项目经营工作流和 7 天落地清单。8 个商品单买合计 ¥232。</p></div><a href="https://github.com/chenxiaolong-maxgent/freelance-ops-kit/issues/1" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f1e45e] px-5 text-sm font-semibold text-[#20213a] transition hover:bg-[#fff587] lg:mt-0">登记全家桶早鸟价 <ArrowRight className="size-4" /></a></div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-xs leading-5 text-muted-foreground">SoloStack 独立接单工具箱 · 所有免费工具无需登录 · 付费登记不自动扣款</footer>
    </main>
  );
}
