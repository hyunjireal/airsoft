import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import AnimatedContent from '../../components/AnimatedContent'
import AnimatedList from '../../components/AnimatedList'
import { PageHeader } from '../../components/PageHeader'
import presetPencilIcon from '../../asset/icons/preset_pencil.svg'
import presetTrashIcon from '../../asset/icons/preset_trash.svg'
import presetPlusIcon from '../../asset/icons/preset_plus.svg'
import './match.css'

type PresetItem = {
  id: string
  title: string
  description: string
}

const appliedPreset: PresetItem = {
  id: 'applied-weekend',
  title: '주말 즐겜용',
  description: '커스텀 프리셋',
}

const presetItems: PresetItem[] = [
  {
    id: 'beginner',
    title: '초보 입문자',
    description: '입문하는 플레이어를 위한\n부담 없는 초보형 프리셋',
  },
  {
    id: 'weekend',
    title: '주말 캐주얼',
    description: '주말 위주로 가볍게 즐기는\n부담 없는 캐주얼 프리셋',
  },
  {
    id: 'team',
    title: '팀플 선호',
    description: '팀원과 협동하며 움직이는\n팀 중심 플레이 프리셋',
  },
  {
    id: 'cqb',
    title: 'CQB 선호',
    description: '근거리 교전을 즐기는\n실내 CQB 중심 프리셋',
  },
]

function PresetActionButtons({ onDelete, onEdit }: { onDelete: () => void; onEdit?: () => void }) {
  return (
    <div className="match_preset_manage_actions" aria-label="프리셋 관리 작업">
      <button className="match_preset_manage_action is_edit" type="button" aria-label="프리셋 수정" onClick={onEdit}>
        <img src={presetPencilIcon} alt="" aria-hidden="true" />
      </button>
      <button className="match_preset_manage_action is_delete" type="button" aria-label="프리셋 삭제" onClick={onDelete}>
        <img src={presetTrashIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  )
}

function PresetCard({
  preset,
  active = false,
  onDelete,
  onEdit,
  useListExit = false,
}: {
  preset: PresetItem
  active?: boolean
  onDelete: () => void
  onEdit?: () => void
  useListExit?: boolean
}) {
  const cardRef = useRef<HTMLElement>(null)

  const deletePreset = () => {
    if (useListExit) {
      onDelete()
      return
    }

    const card = cardRef.current

    if (!card) {
      onDelete()
      return
    }

    gsap.to(card, {
      x: -120,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in',
      pointerEvents: 'none',
      onComplete: onDelete,
    })
  }

  return (
    <article ref={cardRef} className={`match_preset_manage_card${active ? ' is_active' : ''}`}>
      <div className="match_preset_manage_card_text">
        <h3>{preset.title}</h3>
        <p>{preset.description}</p>
      </div>
      <PresetActionButtons onDelete={deletePreset} onEdit={onEdit} />
    </article>
  )
}

export function MatchPresetManage() {
  const navigate = useNavigate()
  const [isAppliedVisible, setIsAppliedVisible] = useState(true)
  const [managedPresets, setManagedPresets] = useState(presetItems)

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/match')
  }

  return (
    <div className="match_preset_manage_page">
      <PageHeader
        className="match_page_header match_preset_manage_header"
        backButtonClassName="match_page_back_button"
        layout="standard"
        title="프리셋 관리"
        titleClassName="match_page_title"
        onBack={goBack}
      />

      <main className="match_preset_manage_body">
        <section className="match_preset_manage_section" aria-labelledby="match-preset-applied-title">
          <h2 id="match-preset-applied-title" className="match_preset_manage_section_title">
            적용된 프리셋
          </h2>
          {isAppliedVisible ? (
            <AnimatedContent distance={28} duration={0.85} ease="power3.out" threshold={0.05} className="match_preset_manage_motion_card">
              <PresetCard preset={appliedPreset} active onDelete={() => setIsAppliedVisible(false)} />
            </AnimatedContent>
          ) : null}
        </section>

        <section className="match_preset_manage_section" aria-labelledby="match-preset-list-title">
          <div className="match_preset_manage_section_head">
            <div className="match_preset_manage_section_label">
              <h2 id="match-preset-list-title" className="match_preset_manage_section_title">
                내 프리셋
              </h2>
              <span className="match_preset_manage_count">({managedPresets.length}/10)</span>
            </div>
            <button className="match_preset_manage_head_add" type="button" aria-label="프리셋 추가">
              <img src={presetPlusIcon} alt="" className="match_preset_option_icon" aria-hidden="true" />
            </button>
          </div>

          <AnimatedList
            items={managedPresets}
            className="match_preset_manage_list"
            displayScrollbar={false}
            showGradients={false}
            enableArrowNavigation={false}
            enableLayoutAnimation
            getItemKey={(preset) => preset.id}
            renderItem={(preset) => (
              <PresetCard
                preset={preset}
                useListExit
                onEdit={() => navigate(`/match/presets/${preset.id}/edit`)}
                onDelete={() => setManagedPresets((currentPresets) => currentPresets.filter((item) => item.id !== preset.id))}
              />
            )}
          />
        </section>
      </main>
    </div>
  )
}
