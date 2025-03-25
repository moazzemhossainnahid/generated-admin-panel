import ContactDetailPage from '@/components/contact/ContactDetailPage';

export default function AdminContactDetailPage({ params }: { params: { id: string } }) {
  return <ContactDetailPage params={params} />;
}