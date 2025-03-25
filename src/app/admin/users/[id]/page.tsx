// app/admin/users/[id]/page.tsx
import EditUserPage from '@/components/users/EditUserPage';

export default function AdminEditUserPage({ params }: { params: { id: string } }) {
  return <EditUserPage params={params} />;
}