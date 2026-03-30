import ChronicFocusMedia from "../ChronicFocusMedia";
import type { Profile } from "../../types";

type Focus = { title: string; points: string[]; image: string };

type Props = {
  nickname: string;
  setNickname: (v: string) => void;
  gender: Profile["gender"];
  setGender: (v: Profile["gender"]) => void;
  age: number;
  setAge: (v: number) => void;
  chronicTypes: Profile["chronicType"][];
  selectedChronic: Profile["chronicType"];
  setSelectedChronic: (v: Profile["chronicType"]) => void;
  currentBands: string[];
  coreMetricBand: string;
  setCoreMetricBand: (v: string) => void;
  saveDietProfile: () => void;
  showProfileEditor: boolean;
  setShowProfileEditor: (v: boolean) => void;
  isThinking: boolean;
  canOpenPlan: boolean;
  currentFocus: Focus;
  setActiveNav: (v: "nutrition") => void;
  aiReply: string;
  aiInput: string;
  setAiInput: (v: string) => void;
  askAi: (q: string) => void;
  quickQuestions: string[];
};

export default function HomeDashboard({
  nickname,
  setNickname,
  gender,
  setGender,
  age,
  setAge,
  chronicTypes,
  selectedChronic,
  setSelectedChronic,
  currentBands,
  coreMetricBand,
  setCoreMetricBand,
  saveDietProfile,
  showProfileEditor,
  setShowProfileEditor,
  isThinking,
  canOpenPlan,
  currentFocus,
  setActiveNav,
  aiReply,
  aiInput,
  setAiInput,
  askAi,
  quickQuestions,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-wide text-warm-text/60">档案任务</p>
              <h3 className="mt-1 text-lg font-semibold">饮食档案{canOpenPlan ? "已完成，可继续完善" : "待完善"}</h3>
              <p className="mt-1 text-sm text-warm-text/70">
                {isThinking ? "正在根据档案更新本周重点..." : "已录入核心信息，可随时查看并编辑。"}
              </p>
            </div>
            <button
              onClick={() => setShowProfileEditor(!showProfileEditor)}
              className="rounded-full border border-warm-border bg-white px-4 py-2 text-sm"
            >
              {showProfileEditor ? "收起档案" : "查看档案 / 编辑档案"}
            </button>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-warm-border/60 bg-white px-3 py-2 text-xs">姓名：{nickname || "-"}</div>
            <div className="rounded-xl border border-warm-border/60 bg-white px-3 py-2 text-xs">年龄：{age || "-"}</div>
            <div className="rounded-xl border border-warm-border/60 bg-white px-3 py-2 text-xs">性别：{gender}</div>
            <div className="rounded-xl border border-warm-border/60 bg-white px-3 py-2 text-xs">慢病类别：{selectedChronic}</div>
            <div className="rounded-xl border border-warm-border/60 bg-white px-3 py-2 text-xs md:col-span-2">核心指标：{coreMetricBand || "未选择"}</div>
          </div>

          {showProfileEditor ? (
            <div className="mt-4 rounded-2xl border border-warm-border/70 bg-white p-4">
              <p className="text-xs tracking-wide text-warm-text/60">饮食档案建立</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="text-sm">昵称<input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2" /></label>
                <label className="text-sm">性别
                  <select value={gender} onChange={(e) => setGender(e.target.value as Profile["gender"])} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2"><option>男</option><option>女</option><option>其他</option></select>
                </label>
                <label className="text-sm">年龄<input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2" /></label>
                <div>
                  <p className="text-sm">慢性病类别</p>
                  <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
                    {chronicTypes.map((type) => (
                      <button key={type} onClick={() => setSelectedChronic(type)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${selectedChronic === type ? "border-leaf-500 bg-leaf-300/25 text-leaf-600" : "border-warm-border bg-white"}`}>{type}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-warm-border/70 bg-warm-bg p-4">
                <p className="text-sm font-semibold">核心指标分档（联动）</p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {currentBands.map((band) => (
                    <button key={band} onClick={() => setCoreMetricBand(band)} className={`rounded-xl border px-3 py-2 text-left text-xs ${coreMetricBand === band ? "border-leaf-500 bg-leaf-300/25 text-leaf-600" : "border-warm-border bg-white"}`}>{band}</button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button onClick={saveDietProfile} className="rounded-full bg-warm-text px-5 py-2 text-sm text-white">保存</button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className="overflow-hidden rounded-3xl border border-warm-border/75 bg-white shadow-soft">
          <div className="grid md:grid-cols-[1fr_330px]">
            <div className="p-7">
              <p className="text-xs tracking-wide text-warm-text/60">本周饮食重点</p>
              <p className="mt-1 text-sm text-warm-text/70">基于当前慢病档案生成</p>
              <h2 className="mt-2 text-3xl font-semibold">{currentFocus.title}</h2>
              <p className="mt-2 text-sm text-warm-text/70">
                已根据你的档案生成本周饮食重点，建议先查看本周计划，再按场景微调。
              </p>
              <div className="mt-4 grid gap-2">{currentFocus.points.map((p) => <div key={p} className="rounded-xl bg-warm-bg px-4 py-2.5 text-sm">{p}</div>)}</div>
              <button onClick={() => setActiveNav("nutrition")} className="mt-5 rounded-full bg-warm-text px-5 py-2 text-sm text-white">查看本周计划</button>
            </div>
            <ChronicFocusMedia chronic={selectedChronic} className="h-full w-full" />
          </div>
        </section>

        <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-5 shadow-soft">
          <p className="text-xs tracking-wide text-warm-text/60">今日晚餐建议</p>
          <h4 className="mt-1 text-base font-semibold">清淡收尾，优先一汤一菜一蛋白</h4>
          <p className="mt-1 text-sm text-warm-text/75">建议主食减量 1/4，避免高盐酱料，睡前不加餐。</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-warm-border/70 bg-white px-2.5 py-1 text-xs text-warm-text/70">低盐</span>
            <span className="rounded-full border border-warm-border/70 bg-white px-2.5 py-1 text-xs text-warm-text/70">少油</span>
            <span className="rounded-full border border-warm-border/70 bg-white px-2.5 py-1 text-xs text-warm-text/70">晚餐不过量</span>
          </div>
          <div className="mt-3 rounded-xl border border-warm-border/70 bg-white px-3 py-2 text-xs text-warm-text/70">
            最近一次调整：把“重口味外卖”替换为“清蒸鱼 + 青菜 + 半碗饭”
          </div>
        </section>

        <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-4 shadow-soft">
          <p className="text-xs tracking-wide text-warm-text/60">今日提醒</p>
          <p className="mt-1 text-sm text-warm-text/85">今日关注：{currentFocus.points[2] ?? "晚餐不过量，保持清淡结构"}</p>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-warm-border/75 bg-warm-card p-4 shadow-soft">
        <p className="text-sm font-semibold">今日饮食微调</p>
        <p className="mt-1 text-xs text-warm-text/65">今天怎么吃，快速问我</p>
        <div className="mt-3 grid gap-2">
          {quickQuestions.map((q) => (
            <button key={q} onClick={() => askAi(q)} className="rounded-xl border border-warm-border bg-white px-3 py-2 text-left text-xs">{q}</button>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-leaf-300/70 bg-leaf-300/20 p-3 text-xs text-warm-text/85">{aiReply}</div>
        <div className="mt-3 flex gap-2">
          <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="输入今天的饮食场景" className="w-full rounded-full border border-warm-border bg-white px-3 py-2 text-xs" />
          <button onClick={() => askAi(aiInput)} className="rounded-full bg-warm-text px-3 py-2 text-xs text-white">发送</button>
        </div>
      </aside>
    </div>
  );
}

