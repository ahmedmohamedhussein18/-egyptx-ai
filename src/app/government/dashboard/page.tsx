import GovernmentDashboardContent from "@/components/GovernmentDashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة تحكم القاهرة الذكية | EgyptX AI",
  description: "نظام ذكي لإدارة وتحليل السياحة والخدمات بمحافظة القاهرة",
};

export default function GovernmentDashboardPage() {
  return <GovernmentDashboardContent />;
}
