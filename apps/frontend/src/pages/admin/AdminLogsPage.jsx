import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminLogsTab from '../../components/admin/AdminLogsTab';

export default function AdminLogsPage() {
  const adminProps = useAdmin();
  return <AdminLogsTab {...adminProps} />;
}
