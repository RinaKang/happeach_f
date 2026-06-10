import { useMemo, useRef, useState } from 'react';
// record: 부모(page.jsx)가 GET /transactions/random 으로 받아온 단일 거래 기록
import { toPng } from 'html-to-image';
import ChevronLeft from '../../../../assets/icons/common/ChevronLeft';
import stickerImg from '../../../../assets/images/sticker.png';
import '../../styles/withdraw/WithdrawPage.css';
import '../../styles/setup/DeleteBankModal.css';

function makeBarcodePattern(seed) {
  const pattern = [
    { barWidth: 10, gap: 1 },
    { barWidth: 8, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 10, gap: 2 },
    { barWidth: 8, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 3, gap: 1 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 2, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
    { barWidth: 3, gap: 2 },
    { barWidth: 1, gap: 2 },
    { barWidth: 2, gap: 1 },
  ];

  const offset = Math.abs(seed % pattern.length);
  return pattern.slice(offset).concat(pattern.slice(0, offset));
}


const TYPE_LABEL = {
  happy: '행복 저금',
  become: '행복해지는 저금',
};

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 백엔드가 UTC 시각을 타임존 표기 없는 "2026-06-08T16:17:07.483506" 형태로 내려줌
// → UTC로 명시 파싱해야 실제 로컬(KST) 시각으로 변환됨
function parseAsLocalDate(value) {
  if (value == null) return null;
  const str = String(value);
  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(str);
  const normalized = /^\d{4}-\d{2}-\d{2}T/.test(str) && !hasTimezone
    ? `${str.replace(/(\.\d{3})\d*$/, '$1')}Z`
    : str;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

// record.date는 백엔드가 UTC 기준으로 미리 포맷한 문자열이라 신뢰할 수 없음
// → createdAt(원본 UTC ISO 시각)을 KST로 변환해 날짜를 계산
function formatReceiptDate(record) {
  const date = parseAsLocalDate(record?.createdAt) ?? parseAsLocalDate(record?.date);
  if (!date) return '';

  return `${DAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatReceiptTime(record) {
  const date = parseAsLocalDate(record?.createdAt) ?? parseAsLocalDate(record?.time) ?? parseAsLocalDate(record?.id);

  if (!date) {
    return '--:--:--';
  }

  return date.toTimeString().slice(0, 8);
}

// record: GET /transactions/random 에서 받아온 단일 기록 (부모에서 주입)
function WithdrawPage({ onBack, bankInfo, record, onDelete }) {
  const exportRef = useRef(null);
  const isDownloadingRef = useRef(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const barcodePattern = useMemo(
    () => (record ? makeBarcodePattern(record.id) : []),
    [record]
  );

  const handleDownload = async () => {
    if (!exportRef.current || !record || isDownloadingRef.current) return;

    isDownloadingRef.current = true;

    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: Math.max(window.devicePixelRatio || 1, 2),
      });

      const link = document.createElement('a');
      const safeDate = String(record.date ?? 'receipt').replace(/[^\w-]+/g, '-');
      link.download = `happeach-receipt-${safeDate}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download receipt PNG.', error);
    } finally {
      isDownloadingRef.current = false;
    }
  };

  const renderReceiptContent = () => (
    <>
      <h2 className="withdrawPage__receiptTitle">
        Happeach&apos;s
        <br />
        Happiness Receipt
      </h2>

      <p className="withdrawPage__receiptDate">
        {formatReceiptDate(record)}
      </p>

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">저금 유형</span>
          <span className="withdrawPage__infoValue">
            {TYPE_LABEL[record.type] ?? '행복 저금'}
          </span>
        </div>
        <div className="withdrawPage__infoRow">
          {/* 닉네임 생성되면 입금자명 닉네임이나 이름으로 변경 */}
          <span className="withdrawPage__infoLabel">입금자명</span>
          <span className="withdrawPage__infoValue">
            {bankInfo?.userName ?? bankInfo?.name ?? '나'}
          </span>
        </div>
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">저금 시간</span>
          <span className="withdrawPage__infoValue">
            {formatReceiptTime(record)}
          </span>
        </div>
      </div>

      <div className="withdrawPage__dashed" />

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">입금 내용</span>
          <span className="withdrawPage__infoValue">{record.memo}</span>
        </div>
      </div>

      <div className="withdrawPage__dashed" />

      <div className="withdrawPage__infoRows">
        <div className="withdrawPage__infoRow">
          <span className="withdrawPage__infoLabel">태그</span>
          <span className="withdrawPage__infoValue">
            {record.hashtag || '-'}
          </span>
        </div>
      </div>

      <div className="withdrawPage__dashed" />

      <div className="withdrawPage__total">
        <span className="withdrawPage__totalLabel">TOTAL</span>
        <span className="withdrawPage__totalAmount">
          ₩{Number(record.amount ?? 0).toLocaleString()}
        </span>
      </div>

      <div className="withdrawPage__barcode" aria-hidden="true">
        {barcodePattern.map(({ barWidth, gap }, i) => (
          <span
            key={i}
            className="withdrawPage__barcodeBar"
            style={{ width: `${barWidth}px`, marginRight: `${gap}px` }}
          />
        ))}
      </div>
    </>
  );

  if (!record) return null;

  return (
    <div className="withdrawPage">
      <div className="withdrawPage__header">
        <button
          className="withdrawPage__backBtn"
          onClick={onBack}
          type="button"
          aria-label="뒤로가기"
        >
          <ChevronLeft />
        </button>
        <button className="withdrawPage__deleteBtn" type="button" onClick={() => setShowDeleteModal(true)}>
          삭제하기
        </button>
      </div>

      <div className="withdrawPage__scroll">
        <div className="withdrawPage__receiptOuter">
          <img
            className="withdrawPage__stickerImg"
            src={stickerImg}
            alt=""
            aria-hidden="true"
          />
          <div className="withdrawPage__receipt">
            {renderReceiptContent()}
          </div>
        </div>
      </div>

      {/* 다운로드 전용 캡처 영역 — 화면에 보이지 않음 */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div
          ref={exportRef}
          style={{ background: '#ffb0ad', padding: '26px 25px 16px', width: '376px', boxSizing: 'border-box' }}
        >
          <div className="withdrawPage__receiptOuter" style={{ maxWidth: '326px' }}>
            <img
              className="withdrawPage__stickerImg"
              src={stickerImg}
              alt=""
            />
            <div className="withdrawPage__receipt">
              {renderReceiptContent()}
            </div>
          </div>
        </div>
      </div>

      <button
        className="withdrawPage__downloadBtn"
        type="button"
        onClick={handleDownload}
      >
        다운로드
      </button>

      {showDeleteModal && (
        <div className="deleteBankModal__overlay">
          <div className="deleteBankModal">
            <h2 className="deleteBankModal__title">기록을 삭제할까요?</h2>
            <p className="deleteBankModal__desc">
              삭제한 기록은 다시 되돌릴 수 없어요.<br />
              기록을 삭제하시겠습니까?
            </p>
            <div className="deleteBankModal__actions">
              <button className="deleteBankModal__btn deleteBankModal__btn--cancel" type="button" onClick={() => setShowDeleteModal(false)}>
                취소
              </button>
              <button className="deleteBankModal__btn deleteBankModal__btn--delete" type="button" onClick={() => { setShowDeleteModal(false); onDelete?.(record.id); }}>
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default WithdrawPage;
