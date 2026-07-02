import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminPlansTab from '../../components/admin/AdminPlansTab';

export default function AdminPlansPage() {
  const adminProps = useAdmin();
  return <AdminPlansTab {...adminProps} />;
}
