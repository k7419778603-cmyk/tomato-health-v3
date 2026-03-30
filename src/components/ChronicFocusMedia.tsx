import type { Profile } from "../types";

type Props = {
  chronic: Profile["chronicType"];
  className?: string;
};

export default function ChronicFocusMedia({ chronic, className = "" }: Props) {
  const imageByChronic: Record<Profile["chronicType"], string> = {
    高血压: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=80",
    "高血糖 / 糖尿病风险": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    "高尿酸 / 痛风": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80",
    "高血脂 / 血脂异常": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
    脂肪肝: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1400&q=80",
    "体重管理 / 肥胖风险": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80",
    其他: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
  };

  return (
    <div className={`${className} relative overflow-hidden rounded-3xl bg-white`} aria-label={`${chronic} 重点计划媒体`}>
      <img src={imageByChronic[chronic]} alt="新鲜蔬菜水果组合" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/20" />
    </div>
  );
}

