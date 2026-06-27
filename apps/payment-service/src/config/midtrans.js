import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'Mid-server-YOUR_SERVER_KEY',
  clientKey: 'Mid-client-YOUR_CLIENT_KEY'
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: 'Mid-server-YOUR_SERVER_KEY',
  clientKey: 'Mid-client-YOUR_CLIENT_KEY'
});
