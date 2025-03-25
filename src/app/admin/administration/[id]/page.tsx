import EditAdminPage from '@/components/admin/EditAdminPage';

export default function AdminEditPage({ params }: { params: { id: string } }) {
  return <EditAdminPage params={params} />;
}