import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-YOUR_SERVER_KEY',
  clientKey: 'SB-Mid-client-YOUR_CLIENT_KEY'
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: 'SB-Mid-server-YOUR_SERVER_KEY',
  clientKey: 'SB-Mid-client-YOUR_CLIENT_KEY'
});
