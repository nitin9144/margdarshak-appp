import AppLayout from '../layout-app';
import { DashboardClient } from './dashboard-client';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="container py-8">
        <DashboardClient />
      </div>
    </AppLayout>
  );
}
