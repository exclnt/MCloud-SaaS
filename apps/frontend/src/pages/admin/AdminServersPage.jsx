import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminServersTab from '../../components/admin/AdminServersTab';

export default function AdminServersPage() {
  const adminProps = useAdmin();
  return <AdminServersTab {...adminProps} />;
}
