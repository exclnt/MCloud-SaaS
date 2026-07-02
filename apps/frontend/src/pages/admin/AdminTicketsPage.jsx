import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminTicketsTab from '../../components/admin/AdminTicketsTab';

export default function AdminTicketsPage() {
  const adminProps = useAdmin();
  return <AdminTicketsTab {...adminProps} />;
}
