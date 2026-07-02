import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import AdminTransactionsTab from '../../components/admin/AdminTransactionsTab';

export default function AdminTransactionsPage() {
  const adminProps = useAdmin();
  return <AdminTransactionsTab {...adminProps} />;
}
