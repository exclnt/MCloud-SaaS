import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminUsersTab from '../../components/admin/AdminUsersTab';

export default function AdminUsersPage() {
  const adminProps = useAdmin();
  return <AdminUsersTab {...adminProps} />;
}
