import ChronicFocusMedia from "../ChronicFocusMedia";
import HomeFlowGuide from "./HomeFlowGuide";
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
  focusChronic: Profile["chronicType"];
  onGoNutritionPlan: () => void;
  onGoKnowledge: () => void;
  onOpenProfileEditor: () => void;
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
  focusChronic,
  onGoNutritionPlan,
  onGoKnowledge,
  onOpenProfileEditor,
}: Props) {
  return (
    <div className="space-y-6">
      <HomeFlowGuide onEditProfile={onOpenProfileEditor} onNutrition={onGoNutritionPlan} onKnowledge={onGoKnowledge} />

      <section className="rounded-2xl border border-warm-border/75 bg-warm-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="mt-1 text-lg font-semibold">
              个人健康档案{canOpenPlan ? "（已完成，可继续完善）" : ""}
            </h3>
            <p className="mt-1 text-sm text-warm-text/70">
              {isThinking ? "正在根据档案更新本周重点..." : "已录入核心信息，可随时查看并编辑。"}
            </p>
          </div>
          <button
            onClick={() => setShowProfileEditor(!showProfileEditor)}
            className="rounded-full border border-warm-border bg-white px-4 py-2 text-sm"
          >
            {showProfileEditor ? "收起档案" : "编辑档案"}
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
            <p className="text-xs tracking-wide text-warm-text/60">个人健康档案建立</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                昵称
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2" />
              </label>
              <label className="text-sm">
                性别
                <select value={gender} onChange={(e) => setGender(e.target.value as Profile["gender"])} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2">
                  <option>男</option>
                  <option>女</option>
                  <option>其他</option>
                </select>
              </label>
              <label className="text-sm">
                年龄
                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2" />
              </label>
              <div>
                <p className="text-sm">慢性病类别</p>
                <div className="mt-1 flex gap-2 overflow-x-auto pb-1">
                  {chronicTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedChronic(type)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${selectedChronic === type ? "border-leaf-500 bg-leaf-300/25 text-leaf-600" : "border-warm-border bg-white"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-warm-border/70 bg-warm-bg p-4">
              <p className="text-sm font-semibold">核心指标分档（联动）</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {currentBands.map((band) => (
                  <button
                    key={band}
                    type="button"
                    onClick={() => setCoreMetricBand(band)}
                    className={`rounded-xl border px-3 py-2 text-left text-xs ${coreMetricBand === band ? "border-leaf-500 bg-leaf-300/25 text-leaf-600" : "border-warm-border bg-white"}`}
                  >
                    {band}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={saveDietProfile} className="rounded-full bg-warm-text px-5 py-2 text-sm text-white">
                  保存
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {isThinking ? (
          <div className="mt-4 rounded-2xl border border-warm-border/70 bg-white p-4">
            <p className="text-xs tracking-wide text-warm-text/60">正在思考新的本周饮食重点…</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-warm-border/25">
              <div className="h-full w-1/3 animate-pulse bg-warm-text/60" />
            </div>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-warm-border/75 bg-white shadow-soft">
        <div className="grid md:grid-cols-[1fr_330px]">
          <div className="p-7">
            <p className="text-xs tracking-wide text-warm-text/60">本周饮食重点</p>
            <h2 className="mt-2 text-3xl font-semibold">{currentFocus.title}</h2>
            <p className="mt-2 text-sm text-warm-text/70">
              已根据你的档案生成本周饮食重点，建议先查看本周计划，再按场景微调。
            </p>
            <div className="mt-4 grid gap-2">
              {currentFocus.points.map((p) => (
                <div key={p} className="rounded-xl bg-warm-bg px-4 py-2.5 text-sm">
                  {p}
                </div>
              ))}
            </div>
            <button type="button" onClick={onGoNutritionPlan} className="mt-5 rounded-full bg-warm-text px-5 py-2 text-sm text-white">
              查看本周计划
            </button>
          </div>
          <ChronicFocusMedia chronic={focusChronic} className="h-full w-full" />
        </div>
      </section>
    </div>
  );
}
