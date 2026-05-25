import { db } from '../config/db.js';
import { mapWallet, mapWalletTransaction } from '../utils/serializers.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';

const query = (text, params = []) => db.query(text, params);

export const getWallet = async (_req, res) => {
  const walletRow = (await query('SELECT * FROM wallet WHERE id = 1')).rows[0];
  const transactions = (await query('SELECT * FROM wallet_transactions ORDER BY id DESC')).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(walletRow), transactions } }, 'Lấy dữ liệu thành công');
};

export const topup = async (req, res) => {
  const amount = Number(req.body?.amount ?? req.body?.topup);
  if (!Number.isFinite(amount) || amount <= 0) {
    sendError(res, 400, 'Số tiền nạp không hợp lệ');
    return;
  }

  const wallet = (await query('UPDATE wallet SET balance = balance + $1, topup = $2 WHERE id = 1 RETURNING *', [amount, String(amount)])).rows[0];
  const transaction = (await query('INSERT INTO wallet_transactions (label, amount, type, time, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['Nạp tiền', amount, 'in', 'Vừa xong', new Date().toISOString()])).rows[0];
  await addActivity('report', 'Ví tiền được nạp', `${amount.toLocaleString('vi-VN')}đ`);
  const transactions = (await query('SELECT * FROM wallet_transactions ORDER BY id DESC')).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(wallet), transactions }, transaction: mapWalletTransaction(transaction) }, 'Nạp tiền thành công', 201);
};

export const withdraw = async (req, res) => {
  const amount = Number(req.body?.amount);
  const bank = String(req.body?.bank ?? '').trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    sendError(res, 400, 'Số tiền rút không hợp lệ');
    return;
  }

  const walletBefore = (await query('SELECT * FROM wallet WHERE id = 1')).rows[0];
  if (amount > walletBefore.balance) {
    sendError(res, 400, 'Số dư không đủ');
    return;
  }

  const wallet = (await query('UPDATE wallet SET balance = balance - $1, selected_bank = COALESCE(NULLIF($2, \'\'), selected_bank) WHERE id = 1 RETURNING *', [amount, bank])).rows[0];
  const transaction = (await query('INSERT INTO wallet_transactions (label, amount, type, time, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['Rút tiền về ngân hàng', amount, 'out', 'Vừa xong', new Date().toISOString()])).rows[0];
  await addActivity('report', 'Ví tiền được rút', `${amount.toLocaleString('vi-VN')}đ`);
  const transactions = (await query('SELECT * FROM wallet_transactions ORDER BY id DESC')).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(wallet), transactions }, transaction: mapWalletTransaction(transaction) }, 'Rút tiền thành công', 201);
};
