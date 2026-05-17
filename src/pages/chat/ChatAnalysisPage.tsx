import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import gaiImage from '../../asset/images/gai.png'
import './ChatAnalysis.css'

const getAnalysisImage = () => sessionStorage.getItem('gai_analysis_image') ?? gaiImage

const detectionPoints = [
  { id: 'goggle', status: 'ok', label: '고글', desc: '안전 등급 보호 고글 착용 확인됨' },
  { id: 'mask', status: 'warn', label: '마스크', desc: '하관 보호 마스크 미착용 — 착용 권장' },
  { id: 'battery', status: 'ok', label: '배터리', desc: '리포 배터리 상태 정상 범위 확인' },
  { id: 'magazine', status: 'ok', label: '탄창', desc: '탄창 구성 적절, 용량 기준 이내' },
  { id: 'glove', status: 'warn', label: '장갑', desc: '손 보호 장비 미감지 — 착용 권장' },
]

const riskItems = [
  { id: 'lens', label: '렌즈 스크래치 가능성', desc: '고글 렌즈 표면 손상 여부를 출전 전 반드시 확인해주세요.' },
  { id: 'battery2', label: '여분 배터리 없음', desc: '장시간 게임 시 배터리 방전 위험. 예비 배터리 지참을 권장합니다.' },
  { id: 'glove2', label: '장갑 미착용', desc: '근거리 전투 및 장애물 이동 시 손 부상 위험이 있습니다.' },
]

const recommendItems = [
  { id: 'mesh', icon: '🛡', title: '메쉬 마스크 추천', desc: 'CQB 환경에서 하관 보호 효과 높음. 통기성도 양호해 초보자에게 적합합니다.', tag: 'SAFETY' },
  { id: 'mag', icon: '🎯', title: '예비 탄창 추가', desc: '기본 탄창 외 1–2개 추가 권장. 게임 흐름을 끊지 않고 빠른 교체가 가능합니다.', tag: 'GEAR' },
  { id: 'hop', icon: '⚙️', title: '홉업 초기 세팅 권장', desc: '처음 사용 시 홉업을 기본값으로 초기화 후 소량씩 조정하는 것이 안전합니다.', tag: 'SETUP' },
]

const regulationItems = [
  { label: '실내 필드 탄속', value: '0.98J 이하 (약 90m/s)' },
  { label: '실외 필드 탄속', value: '1.0J 이하 (약 100m/s)' },
  { label: '보호장비', value: '고글 착용 필수 (ANSI Z87.1 이상)' },
  { label: '칼라파트', value: '이동 중 항상 장착 유지' },
]

export function ChatAnalysisPage() {
  const navigate = useNavigate()
  const [uploadedImage, setUploadedImage] = useState(getAnalysisImage)
  const [sectionsVisible, setSectionsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const syncImage = () => setUploadedImage(getAnalysisImage())

    syncImage()
    window.addEventListener('focus', syncImage)
    window.addEventListener('storage', syncImage)

    return () => {
      window.removeEventListener('focus', syncImage)
      window.removeEventListener('storage', syncImage)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setSectionsVisible(true), 300)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is_visible')
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    sectionRefs.current.forEach((el) => el && observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [sectionsVisible])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el
    if (el && observerRef.current) observerRef.current.observe(el)
  }

  return (
    <div className="gai_report_page">
      <PageHeader title="분석 리포트" onBack={() => navigate(-1)} />

      <div className="gai_report_scroll">
        {/* Hero */}
        <section className="gai_report_hero">
          <div className="gai_report_image_wrap">
            <div className="gai_report_scan_overlay" aria-hidden="true">
              <div className="gai_report_scan_line" />
              <span className="gai_report_corner tl" />
              <span className="gai_report_corner tr" />
              <span className="gai_report_corner bl" />
              <span className="gai_report_corner br" />
            </div>
            <img src={uploadedImage} className="gai_report_hero_img" alt="분석된 장비" />
            <div className="gai_report_done_badge">
              <span className="gai_report_done_dot" aria-hidden="true" />
              분석 완료
            </div>
          </div>

        </section>

        {/* Detection */}
        <section className="gai_report_section gai_reveal" ref={setRef(0)}>
          <h2 className="gai_report_section_title">
            <span className="gai_report_section_dot" aria-hidden="true" />
            AI 감지 포인트
          </h2>
          <div className="gai_report_detect_list">
            {detectionPoints.map((item, i) => (
              <div
                className={`gai_report_detect_item gai_reveal_item`}
                key={item.id}
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <span className={`gai_report_detect_icon is_${item.status}`} aria-hidden="true">
                  {item.status === 'ok' ? '✓' : '!'}
                </span>
                <div className="gai_report_detect_body">
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </div>
                <span className={`gai_report_detect_badge is_${item.status}`}>
                  {item.status === 'ok' ? '확인됨' : '미확인'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Risk */}
        <section className="gai_report_section gai_reveal" ref={setRef(1)}>
          <h2 className="gai_report_section_title">
            <span className="gai_report_section_dot is_warn" aria-hidden="true" />
            위험 요소
          </h2>
          <div className="gai_report_risk_list">
            {riskItems.map((item, i) => (
              <div
                className="gai_report_risk_item gai_reveal_item"
                key={item.id}
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="gai_report_risk_icon" aria-hidden="true">⚠</span>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommend */}
        <section className="gai_report_section gai_reveal" ref={setRef(2)}>
          <h2 className="gai_report_section_title">
            <span className="gai_report_section_dot is_lime" aria-hidden="true" />
            AI 추천 액션
          </h2>
          <div className="gai_report_rec_list">
            {recommendItems.map((item, i) => (
              <div
                className="gai_report_rec_item gai_reveal_item"
                key={item.id}
                style={{ '--reveal-delay': `${i * 100}ms` } as React.CSSProperties}
              >
                <div className="gai_report_rec_head">
                  <span className="gai_report_rec_icon" aria-hidden="true">{item.icon}</span>
                  <strong>{item.title}</strong>
                  <span className="gai_report_rec_tag">{item.tag}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Regulation */}
        <section className="gai_report_section gai_reveal" ref={setRef(3)}>
          <h2 className="gai_report_section_title">
            <span className="gai_report_section_dot is_muted" aria-hidden="true" />
            국내 필드 규정 참고
          </h2>
          <div className="gai_report_reg_card">
            {regulationItems.map((item) => (
              <div className="gai_report_reg_row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <div className="gai_report_bottom_space" aria-hidden="true" />
      </div>

      {/* Fixed CTA */}
      <div className="gai_report_cta">
        <button
          className="gai_report_cta_btn is_secondary"
          type="button"
          onClick={() => navigate('/home')}
        >
          홈으로 돌아가기
        </button>
        <button
          className="gai_report_cta_btn is_primary"
          type="button"
          onClick={() => navigate('/chat')}
        >
          AI에게 추가 질문
        </button>
      </div>
    </div>
  )
}
