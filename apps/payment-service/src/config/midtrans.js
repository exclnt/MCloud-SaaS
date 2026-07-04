import midtransClient from 'midtrans-client';
import 'dotenv/config';

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const serverKey = process.env.MIDTRANS_SERVER_KEY || 'Mid-server-YOUR_SERVER_KEY';
const clientKey = process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-YOUR_CLIENT_KEY';

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey
});

export const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey
});
