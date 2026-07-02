import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminOverviewTab from '../../components/admin/AdminOverviewTab';

export default function AdminOverviewPage() {
  const adminProps = useAdmin();
  return <AdminOverviewTab {...adminProps} />;
}
