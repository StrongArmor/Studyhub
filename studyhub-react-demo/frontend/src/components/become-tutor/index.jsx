import { useState, useEffect } from 'react';
import { Navbar, Footer } from '../common';
import { useTutorForm } from '../../hooks';
import { useApp } from '../../store/AppContext';

const SUBJECTS = [
  'Toán học', 'Vật lý', 'Hóa học', 'Sinh học',
  'Tiếng Anh', 'IELTS', 'Tiếng Nhật', 'Tiếng Trung',
  'Lập trình Python', 'Data Science', 'Web Development', 'Lập trình Java',
];

const STEPS = ['Cá nhân', 'Môn học & Giá', 'Kinh nghiệm', 'Xác nhận'];

const TIME_SLOTS = [
  ['morning', 'Sáng (6h – 12h)'],
  ['afternoon', 'Chiều (12h – 18h)'],
  ['evening', 'Tối (18h – 22h)'],
];

const EDUCATION_OPTIONS = ['Đại học', 'Thạc sĩ', 'Tiến sĩ'];

export function BecomeTutorPage() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const { tutorForm, setField, toggleSubject, submit } = useTutorForm();
  const { state, showToast } = useApp();

  useEffect(() => {
    const user = state.currentUser;
    if (!tutorForm.name) setField('name', user?.name || '');
    if (!tutorForm.email) setField('email', user?.email || '');
    if (!tutorForm.phone) setField('phone', '0912 345 678');
    if (!tutorForm.subjects.length) { toggleSubject('Toán học'); toggleSubject('Vật lý'); }
    if (!tutorForm.price) setField('price', '150000');
    if (!tutorForm.timeSlot) setField('timeSlot', 'evening');
    if (!tutorForm.education) setField('education', 'Đại học');
    if (!tutorForm.experience) setField('experience', '3');
    if (!tutorForm.bio) setField('bio', 'Gia sư tận tâm với 3 năm kinh nghiệm giảng dạy. Chuyên ôn thi THPT Quốc gia và luyện thi học sinh giỏi. Phương pháp dạy học rõ ràng, dễ hiểu, bám sát chương trình.');
  }, []);

  const validate = () => {
    if (step === 1) {
      if (!tutorForm.name.trim()) return showToast('Vui lòng nhập họ tên', 'error');
      if (!tutorForm.email.trim()) return showToast('Vui lòng nhập email', 'error');
      if (!/\S+@\S+\.\S+/.test(tutorForm.email)) return showToast('Email không hợp lệ', 'error');
    }
    if (step === 2) {
      if (!tutorForm.subjects.length) return showToast('Vui lòng chọn ít nhất 1 môn học', 'error');
      if (!tutorForm.price || Number(tutorForm.price) < 50000) return showToast('Giá tối thiểu 50.000đ/buổi', 'error');
    }
    if (step === 3) {
      if (!tutorForm.bio.trim()) return showToast('Vui lòng nhập mô tả bản thân', 'error');
    }
    return true;
  };

  const next = () => { if (validate() === true) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  return (
    <>
      <Navbar active="become-tutor" />
      <div className="page-container" style={{ maxWidth: 680 }}>
        <div className="page-header">
          <h1>Đăng ký làm gia sư</h1>
          <p>Chia sẻ kiến thức và tạo thu nhập cùng StudyHub</p>
        </div>

        <StepBar current={step} />

        {step === 1 && (
          <div className="wallet-card">
            <h3>Thông tin cá nhân</h3>
            <div className="input-group">
              <label className="input-label">Họ và tên *</label>
              <input className="input-field no-icon" value={tutorForm.name} onChange={(e) => setField('name', e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="input-group">
              <label className="input-label">Email *</label>
              <input className="input-field no-icon" type="email" value={tutorForm.email} onChange={(e) => setField('email', e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="input-group">
              <label className="input-label">Số điện thoại</label>
              <input className="input-field no-icon" value={tutorForm.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="0912 345 678" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wallet-card">
            <h3>Môn học &amp; Giảng dạy</h3>
            <div className="input-group">
              <label className="input-label">Môn học giảng dạy *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {SUBJECTS.map((s) => {
                  const active = tutorForm.subjects.includes(s);
                  return (
                    <div
                      key={s}
                      onClick={() => toggleSubject(s)}
                      style={{
                        cursor: 'pointer', padding: '6px 14px', borderRadius: 20,
                        background: active ? '#3B5BDB' : '#f1f3f5',
                        color: active ? '#fff' : '#495057',
                        fontSize: 13, fontWeight: active ? 600 : 400,
                        border: `1.5px solid ${active ? '#3B5BDB' : '#dee2e6'}`,
                        userSelect: 'none', transition: 'all .15s',
                      }}
                    >
                      {s}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Giá/buổi 45 phút (đ) *</label>
              <input
                className="input-field no-icon"
                type="number"
                min="50000"
                step="10000"
                value={tutorForm.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="150000"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Khung giờ dạy</label>
              <div className="radio-group">
                {TIME_SLOTS.map(([val, label]) => (
                  <label key={val} className="radio-label">
                    <input type="radio" name="timeSlot" checked={tutorForm.timeSlot === val} onChange={() => setField('timeSlot', val)} />
                    {' '}{label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wallet-card">
            <h3>Kinh nghiệm &amp; Học vấn</h3>
            <div className="input-group">
              <label className="input-label">Trình độ học vấn</label>
              <select
                className="filter-select"
                style={{ width: '100%' }}
                value={tutorForm.education}
                onChange={(e) => setField('education', e.target.value)}
              >
                <option value="">Chọn trình độ</option>
                {EDUCATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Số năm kinh nghiệm giảng dạy</label>
              <input
                className="input-field no-icon"
                type="number"
                min="0"
                max="50"
                value={tutorForm.experience}
                onChange={(e) => setField('experience', e.target.value)}
                placeholder="3"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Mô tả bản thân *</label>
              <textarea
                className="input-field no-icon"
                rows={5}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                value={tutorForm.bio}
                onChange={(e) => setField('bio', e.target.value)}
                placeholder="Giới thiệu kinh nghiệm, phong cách giảng dạy và điểm mạnh của bạn..."
              />
            </div>
            <div className="input-group">
              <label className="input-label">Minh chứng bằng cấp / chứng chỉ</label>
              <p className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                Chấp nhận PDF, ảnh scan (JPG, PNG). Tối đa 5 file, mỗi file không quá 10MB.
              </p>
              <UploadZone files={files} setFiles={setFiles} showToast={showToast} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wallet-card">
            <h3>Xác nhận thông tin</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <InfoRow label="Họ tên" value={tutorForm.name} />
              <InfoRow label="Email" value={tutorForm.email} />
              {tutorForm.phone && <InfoRow label="Số điện thoại" value={tutorForm.phone} />}
              <InfoRow label="Môn học" value={tutorForm.subjects.join(', ')} />
              <InfoRow label="Giá/buổi" value={`${Number(tutorForm.price).toLocaleString()}đ`} />
              {tutorForm.timeSlot && <InfoRow label="Khung giờ" value={{ morning: 'Sáng (6h–12h)', afternoon: 'Chiều (12h–18h)', evening: 'Tối (18h–22h)' }[tutorForm.timeSlot]} />}
              {tutorForm.education && <InfoRow label="Học vấn" value={tutorForm.education} />}
              {tutorForm.experience && <InfoRow label="Kinh nghiệm" value={`${tutorForm.experience} năm`} />}
              <div style={{ padding: '12px 0' }}>
                <div className="muted" style={{ marginBottom: 6 }}>Mô tả bản thân</div>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '10px 14px', fontSize: 14, lineHeight: 1.6 }}>{tutorForm.bio}</div>
              </div>
            </div>
            {files.length > 0 && (
              <div style={{ padding: '10px 0' }}>
                <div className="muted" style={{ marginBottom: 6 }}>Minh chứng đính kèm ({files.length} file)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span>{f.type === 'application/pdf' ? '📄' : '🖼️'}</span>
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span className="muted" style={{ fontSize: 11 }}>({(f.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 8, padding: '12px 16px', background: '#e7f5ff', borderRadius: 8, fontSize: 13, color: '#1971c2', lineHeight: 1.6 }}>
              Đơn đăng ký sẽ được xét duyệt trong vòng <strong>24 giờ</strong>. Chúng tôi sẽ liên hệ qua email khi có kết quả.
            </div>
          </div>
        )}

        <div className="row-actions" style={{ marginTop: 24, justifyContent: 'space-between' }}>
          <div>
            {step > 1 && (
              <button className="btn btn-outline" onClick={back}>← Quay lại</button>
            )}
          </div>
          <div>
            {step < 4
              ? <button className="btn btn-primary" onClick={next}>Tiếp theo →</button>
              : <button className="btn btn-primary" onClick={submit}>Gửi đơn đăng ký</button>
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function StepBar({ current }) {
  return (
    <div style={{ display: 'flex', marginBottom: 32 }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {i > 0 && (
              <div style={{ position: 'absolute', left: 0, right: '50%', top: 15, height: 2, background: done || active ? '#3B5BDB' : '#dee2e6' }} />
            )}
            {i < STEPS.length - 1 && (
              <div style={{ position: 'absolute', left: '50%', right: 0, top: 15, height: 2, background: done ? '#3B5BDB' : '#dee2e6' }} />
            )}
            <div style={{
              width: 32, height: 32, borderRadius: '50%', zIndex: 1,
              background: active || done ? '#3B5BDB' : '#f1f3f5',
              color: active || done ? '#fff' : '#adb5bd',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13,
            }}>
              {done ? '✓' : n}
            </div>
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: active ? 700 : 400, color: active ? '#3B5BDB' : done ? '#3B5BDB' : '#adb5bd' }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

function UploadZone({ files, setFiles, showToast }) {
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming) => {
    const valid = [];
    for (const f of incoming) {
      if (!ACCEPTED.includes(f.type)) { showToast(`${f.name}: chỉ chấp nhận PDF, JPG, PNG`, 'error'); continue; }
      if (f.size > MAX_SIZE) { showToast(`${f.name}: vượt giới hạn 10MB`, 'error'); continue; }
      if (files.length + valid.length >= MAX_FILES) { showToast(`Tối đa ${MAX_FILES} file`, 'error'); break; }
      if (files.some((x) => x.name === f.name && x.size === f.size)) continue;
      valid.push(f);
    }
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const onInput = (e) => { addFiles([...e.target.files]); e.target.value = ''; };
  const onDrop = (e) => { e.preventDefault(); setDragging(false); addFiles([...e.dataTransfer.files]); };
  const remove = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const iconFor = (f) => f.type === 'application/pdf' ? '📄' : '🖼️';
  const sizeLabel = (b) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div>
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '28px 16px', borderRadius: 10, cursor: 'pointer',
          border: `2px dashed ${dragging ? '#3B5BDB' : '#ced4da'}`,
          background: dragging ? '#eef2ff' : '#f8f9fa',
          transition: 'all .15s',
        }}
      >
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple style={{ display: 'none' }} onChange={onInput} />
        <span style={{ fontSize: 28 }}>📎</span>
        <span style={{ fontSize: 14, color: '#495057', fontWeight: 500 }}>Kéo thả file vào đây hoặc <span style={{ color: '#3B5BDB', textDecoration: 'underline' }}>chọn file</span></span>
        <span style={{ fontSize: 12, color: '#adb5bd' }}>PDF, JPG, PNG — tối đa {MAX_FILES} file · 10MB/file</span>
      </label>

      {files.length > 0 && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f1f3f5', borderRadius: 8 }}>
              <span style={{ fontSize: 20 }}>{iconFor(f)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                <div style={{ fontSize: 11, color: '#868e96' }}>{sizeLabel(f.size)}</div>
              </div>
              <button
                onClick={() => remove(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#868e96', fontSize: 16, lineHeight: 1, padding: 4 }}
                title="Xóa"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #f1f3f5' }}>
      <span className="muted" style={{ flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 500, textAlign: 'right', marginLeft: 16 }}>{value}</span>
    </div>
  );
}
