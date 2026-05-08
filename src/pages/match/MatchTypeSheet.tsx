type MatchKind = 'personal' | 'team' | 'guest'

type SheetOption = {
  value: MatchKind
  label: string
  description: string
  accent: string
  symbol: string
}

const options: SheetOption[] = [
  {
    value: 'personal',
    label: '개인 모집',
    description: '함께 플레이할 인원을 모집해요',
    accent: '#10425d',
    symbol: '개인',
  },
  {
    value: 'team',
    label: '팀 모집',
    description: '대전할 팀을 찾아요',
    accent: '#1f2b45',
    symbol: '팀',
  },
  {
    value: 'guest',
    label: '용병 모집',
    description: '특정 포지션의 용병을 구해요',
    accent: '#676b5d',
    symbol: '용병',
  },
]

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (kind: MatchKind) => void
}

export function MatchTypeSheet({ open, onClose, onSelect }: Props) {
  if (!open) return null

  return (
    <>
      <div className="mts_backdrop" onClick={onClose} aria-hidden="true" />
      <div className="mts_sheet" role="dialog" aria-modal="true" aria-label="모집 유형 선택">
        <div className="mts_handle" />
        <div className="mts_header">
          <h2 className="mts_title">어떤 모집 글을 올릴까요?</h2>
          <button className="mts_close" type="button" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="mts_options">
          {options.map((opt) => (
            <button
              key={opt.value}
              className="mts_option"
              type="button"
              onClick={() => onSelect(opt.value)}
            >
              <span className="mts_badge" style={{ background: opt.accent }}>{opt.symbol}</span>
              <div className="mts_option_text">
                <strong className="mts_option_label">{opt.label}</strong>
                <span className="mts_option_desc">{opt.description}</span>
              </div>
              <span className="mts_option_arrow">›</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
