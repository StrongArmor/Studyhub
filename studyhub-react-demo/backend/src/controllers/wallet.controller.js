import { db } from '../config/db.js';
import { mapWallet, mapWalletTransaction } from '../utils/serializers.js';
import { insertActivity as addActivity } from '../services/activity.service.js';
import { sendError, sendSuccess } from '../utils/responses.js';

const query = (text, params = []) => db.query(text, params);

const getOrCreateWallet = async (userId) => {
  await query(
    'INSERT INTO wallet (user_id, balance, banks_json) VALUES ($1, 0, $2) ON CONFLICT (user_id) DO NOTHING',
    [userId, '[]']
  );
  return (await query('SELECT * FROM wallet WHERE user_id = $1', [userId])).rows[0];
};

const saveBank = async (userId, bank) => {
  if (!bank) return;
  const wallet = await getOrCreateWallet(userId);
  const banks = JSON.parse(wallet.banks_json || '[]');
  if (!banks.includes(bank)) {
    banks.unshift(bank);
    const trimmed = banks.slice(0, 10);
    await query('UPDATE wallet SET banks_json = $1 WHERE user_id = $2', [JSON.stringify(trimmed), userId]);
  }
};

export const getWallet = async (req, res) => {
  const userId = req.user.id;
  const walletRow = await getOrCreateWallet(userId);
  const transactions = (await query('SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY id DESC', [userId])).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(walletRow), transactions } }, 'Lấy dữ liệu thành công');
};

export const topup = async (req, res) => {
  const userId = req.user.id;
  const amount = Number(req.body?.amount);
  const bank = String(req.body?.bank ?? '').trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    sendError(res, 400, 'Số tiền nạp không hợp lệ');
    return;
  }

  await getOrCreateWallet(userId);
  await saveBank(userId, bank);
  const wallet = (await query('UPDATE wallet SET balance = balance + $1 WHERE user_id = $2 RETURNING *', [amount, userId])).rows[0];
  const transaction = (await query('INSERT INTO wallet_transactions (user_id, label, amount, type, time, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, 'Nạp tiền', amount, 'in', 'Vừa xong', new Date().toISOString()])).rows[0];
  await addActivity('report', 'Ví tiền được nạp', `${amount.toLocaleString('vi-VN')}đ`);
  const transactions = (await query('SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY id DESC', [userId])).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(wallet), transactions }, transaction: mapWalletTransaction(transaction) }, 'Nạp tiền thành công', 201);
};

export const withdraw = async (req, res) => {
  const userId = req.user.id;
  const amount = Number(req.body?.amount);
  const bank = String(req.body?.bank ?? '').trim();
  if (!Number.isFinite(amount) || amount <= 0) {
    sendError(res, 400, 'Số tiền rút không hợp lệ');
    return;
  }

  const walletBefore = await getOrCreateWallet(userId);
  if (amount > walletBefore.balance) {
    sendError(res, 400, 'Số dư không đủ');
    return;
  }

  await saveBank(userId, bank);
  const wallet = (await query('UPDATE wallet SET balance = balance - $1 WHERE user_id = $2 RETURNING *', [amount, userId])).rows[0];
  const transaction = (await query('INSERT INTO wallet_transactions (user_id, label, amount, type, time, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, 'Rút tiền về ngân hàng', amount, 'out', 'Vừa xong', new Date().toISOString()])).rows[0];
  await addActivity('report', 'Ví tiền được rút', `${amount.toLocaleString('vi-VN')}đ`);
  const transactions = (await query('SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY id DESC', [userId])).rows.map(mapWalletTransaction);
  sendSuccess(res, { wallet: { ...mapWallet(wallet), transactions }, transaction: mapWalletTransaction(transaction) }, 'Rút tiền thành công', 201);
};
