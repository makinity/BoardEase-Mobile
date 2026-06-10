export type Report = {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  summary?: Record<string, number>;
};
