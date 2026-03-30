type Step = { n: number; title: string };

const steps: Step[] = [
  { n: 1, title: "编辑档案" },
  { n: 2, title: "饮食计划" },
  { n: 3, title: "个性化调整" },
  { n: 4, title: "知识科普" },
];

type Props = {
  onEditProfile: () => void;
  onNutrition: () => void;
  onKnowledge: () => void;
};

export default function HomeFlowGuide({ onEditProfile, onNutrition, onKnowledge }: Props) {
  const handlerFor = (n: number) => {
    if (n === 1) return onEditProfile;
    if (n === 2 || n === 3) return onNutrition;
    return onKnowledge;
  };

  return (
    <section className="rounded-xl border border-warm-border/70 bg-warm-card/80 px-3 py-3 shadow-sm">
      <p className="text-center text-xs font-medium tracking-wide text-warm-text/65 sm:text-sm">使用流程</p>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-warm-text sm:text-sm">
        {steps.map((s, i) => (
          <span key={s.n} className="inline-flex items-center gap-2">
            {i > 0 ? (
              <span className="select-none text-warm-text/35" aria-hidden>
                →
              </span>
            ) : null}
            <button
              type="button"
              onClick={handlerFor(s.n)}
              className="inline-flex items-center gap-2 rounded-full border border-warm-border/65 bg-white/95 px-2.5 py-1.5 transition hover:border-leaf-300/80 hover:bg-leaf-300/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400/50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-leaf-400/75 bg-leaf-300/15 text-xs font-semibold text-leaf-700">
                {s.n}
              </span>
              <span className="font-medium text-warm-text/90">{s.title}</span>
            </button>
          </span>
        ))}
      </div>
    </section>
  );
}
