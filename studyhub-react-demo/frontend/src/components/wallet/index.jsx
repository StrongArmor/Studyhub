import { useState, useRef } from 'react';
import { useApp } from '../../store/AppContext';
import { Navbar, Footer } from '../common';

export function WalletPage() {
  const { state, dispatch, showToast } = useApp();
  const { wallet } = state;
  const [mode, setMode] = useState(null);
  const [showAllTxn, setShowAllTxn] = useState(false);
  const [step, setStep] = useState('form');
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState(wallet.banks[0] || '');
  const [otp, setOtp] = useState(['','','','','','']);
  const otpRefs = useRef([]);

  const open = (m) => { setMode(m); setStep('form'); setAmount(''); setBank(wallet.banks[0] || ''); setOtp(['','','','','','']); };
  const close = () => setMode(null);

  const handleContinue = () => {
    const amt = Number(amount);
    if (!amt || amt < 10000) return showToast('Số tiền tối thiểu 10.000đ', 'error');
    if (mode === 'withdraw' && amt > wallet.balance) return showToast('Số tiền vượt số dư khả dụng', 'error');
    if (!bank) return showToast('Vui lòng chọn tài khoản ngân hàng', 'error');
    setStep('otp');
  };

  const handleConfirm = () => {
    if (otp.join('').length < 6) return showToast('Vui lòng nhập đủ 6 chữ số OTP', 'error');
    const amt = Number(amount);
    if (mode === 'topup') {
      dispatch({ type: 'SET_WALLET', payload: { balance: wallet.balance + amt, transactions: [{ id: Date.now(), label: `Nạp tiền từ ${bank}`, amount: amt, type: 'in', time: 'Vừa xong' }, ...wallet.transactions] } });
    } else {
      dispatch({ type: 'SET_WALLET', payload: { balance: wallet.balance - amt, transactions: [{ id: Date.now(), label: `Rút tiền về ${bank}`, amount: amt, type: 'out', time: 'Vừa xong' }, ...wallet.transactions] } });
    }
    setStep('done');
  };

  const setDigit = (idx, value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 1);
    const next = [...otp]; next[idx] = cleaned;
    setOtp(next);
    if (cleaned && idx < 5) setTimeout(() => otpRefs.current[idx + 1]?.focus(), 0);
  };
  const handleKey = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const next = [...otp]; next[idx - 1] = '';
      setOtp(next);
      setTimeout(() => otpRefs.current[idx - 1]?.focus(), 0);
    }
  };

  const label = mode === 'topup' ? 'Nạp tiền' : 'Rút tiền';

  return (
    <><Navbar active="role-select" />
    <div className="page-container">
      <div className="page-header"><h1>Ví cá nhân</h1><p>Nạp tiền, rút tiền và lịch sử giao dịch</p></div>
      <div className="wallet-layout">

        <div className="wallet-card balance-card">
          <div className="muted">Số dư khả dụng</div>
          <div className="balance-value">{wallet.balance.toLocaleString()}đ</div>

          {!mode && (
            <div className="row-actions">
              <button className="btn btn-primary" onClick={() => open('topup')}>Nạp tiền</button>
              <button className="btn btn-outline" onClick={() => open('withdraw')}>Rút tiền</button>
            </div>
          )}

          {mode && step === 'form' && (
            <div style={{ marginTop: 16 }}>
              <div className="input-group">
                <label className="input-label">Số tiền {mode === 'topup' ? 'nạp' : 'rút'}</label>
                <input className="input-field no-icon" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="500000" inputMode="numeric" />
              </div>
              <div className="input-group">
                <label className="input-label">Tài khoản ngân hàng</label>
                <div className="bank-list">
                  {wallet.banks.map((b) => (
                    <div key={b} className={`bank-item ${bank === b ? 'active' : ''}`} onClick={() => setBank(b)}>{b}</div>
                  ))}
                </div>
              </div>
              <div className="row-actions">
                <button className="btn btn-primary" onClick={handleContinue}>Tiếp tục</button>
                <button className="btn btn-outline" onClick={close}>Huỷ</button>
              </div>
            </div>
          )}

          {mode && step === 'otp' && (
            <div style={{ marginTop: 16 }}>
              <div className="muted" style={{ marginBottom: 12 }}>Nhập mã OTP xác nhận {label.toLowerCase()}</div>
              <div className="otp-inputs">
                {otp.map((digit, idx) => (
                  <input key={idx} ref={(el) => otpRefs.current[idx] = el} className={`otp-input ${digit ? 'filled' : ''}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => setDigit(idx, e.target.value)} onKeyDown={(e) => handleKey(e, idx)} />
                ))}
              </div>
              <div className="row-actions" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={handleConfirm}>Xác nhận</button>
                <button className="btn btn-outline" onClick={() => setStep('form')}>Quay lại</button>
              </div>
            </div>
          )}

          {mode && step === 'done' && (
            <div style={{ marginTop: 16 }}>
              <div className="status-banner">{label} {Number(amount).toLocaleString()}đ thành công!</div>
              <div className="row-actions" style={{ marginTop: 12 }}>
                <button className="btn btn-outline" onClick={close}>Xong</button>
              </div>
            </div>
          )}
        </div>

        <div className="wallet-card">
          <div className="admin-card-header">
            <h3>Lịch sử giao dịch</h3>
            {wallet.transactions.length > 5 && <button className="btn btn-outline btn-sm" onClick={() => setShowAllTxn(true)}>Xem tất cả ({wallet.transactions.length})</button>}
          </div>
          <div className="transaction-list">
            {wallet.transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="txn-item">
                <div><strong>{t.label}</strong><div className="muted">{t.time}</div></div>
                <div className={t.type === 'in' ? 'txn-in' : 'txn-out'}>{t.type === 'in' ? '+' : '-'}{t.amount.toLocaleString()}đ</div>
              </div>
            ))}
          </div>
        </div>

        {showAllTxn && (
          <div className="modal-overlay" onClick={() => setShowAllTxn(false)}>
            <div className="error-modal" style={{ maxWidth: 480, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div className="error-modal-title">Tất cả giao dịch</div>
              <div className="transaction-list" style={{ marginTop: 12 }}>
                {wallet.transactions.map((t) => (
                  <div key={t.id} className="txn-item">
                    <div><strong>{t.label}</strong><div className="muted">{t.time}</div></div>
                    <div className={t.type === 'in' ? 'txn-in' : 'txn-out'}>{t.type === 'in' ? '+' : '-'}{t.amount.toLocaleString()}đ</div>
                  </div>
                ))}
              </div>
              <div className="error-modal-actions" style={{ marginTop: 16 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAllTxn(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
    <Footer /></>
  );
}

export function WithdrawPage() { return <WalletPage />; }
