import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminSettingsTab from '../../components/admin/AdminSettingsTab';

export default function AdminSettingsPage() {
  const adminProps = useAdmin();
  return <AdminSettingsTab {...adminProps} />;
}
