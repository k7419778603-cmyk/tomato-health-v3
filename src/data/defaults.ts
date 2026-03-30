import type { PlanCard, Profile } from "../types";
import { safeRandomId } from "../utils/id";

export const defaultProfiles: Profile[] = [
  {
    id: safeRandomId(),
    name: "刘琪",
    gender: "女",
    age: 26,
    chronicType: "高血压",
    coreMetric: "138/88 mmHg（目标 <130/80）",
    focusArea: "稳压 + 晚间节奏",
    goal: "本周把晚饭后步行稳定到 5 天",
    statusTags: ["外食偏多", "晚睡", "久坐"],
    checkupAlert: "mild",
    updatedAt: new Date().toISOString(),
  },
  {
    id: safeRandomId(),
    name: "张晨",
    gender: "男",
    age: 33,
    chronicType: "高血糖 / 糖尿病风险",
    coreMetric: "空腹血糖 6.8 mmol/L（目标 <6.1）",
    focusArea: "控糖 + 饭后活动",
    goal: "本周减少含糖饮料到 1 次以内",
    statusTags: ["下午犯困", "含糖饮料"],
    checkupAlert: "none",
    updatedAt: new Date().toISOString(),
  },
];

export const getPlanCards = (name: string): PlanCard[] => [
  {
    key: "nutrition",
    title: "饮食计划",
    todayFocus: "今天先换掉午后含糖饮料",
    summary: `${name} 今天只需要先完成一件事：把含糖饮料替换成无糖选项。`,
    status: "进行中",
  },
];
