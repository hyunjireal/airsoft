import { useParams } from 'react-router-dom'
import { ActionCard, Card, EmptyState, MatchCard, PageHeader, RecruitCard, Section } from '../components'
import { matches, recruitPosts } from '../data/matches'
import { mySchedules } from '../data/user'
import { useAppStore } from '../stores/useAppStore'

export function MatchPage() {
  return (
    <>
      <PageHeader title="매치" description="참여, 생성, 토너먼트, 내 신청 현황으로 이어지는 매치 허브입니다." />
      <Section title="참여하기">
        <div className="grid grid--three">
          <ActionCard title="개인 참가" description="혼자 참가 가능한 경기를 둘러봅니다." to="/match/join/solo" />
          <ActionCard title="팀 참가" description="소속 팀 단위로 신청할 수 있는 흐름입니다." to="/match/join/team" />
          <ActionCard title="용병/게스트 참가" description="부족한 인원을 채우는 모집에 참여합니다." to="/match/join/guest" />
        </div>
      </Section>
      <Section title="만들기">
        <div className="grid grid--three">
          <ActionCard title="팀 만들기" description="새 팀 소개와 모집 조건을 작성합니다." to="/match/create/team" />
          <ActionCard title="용병/게스트 모집" description="기존 매치에 필요한 인원을 모집합니다." to="/match/create/recruit" />
          <ActionCard title="선택 경기 생성" description="날짜, 필드, 참가 조건을 설정합니다." to="/match/create/game" />
        </div>
      </Section>
      <Section title="토너먼트와 신청">
        <div className="grid">
          <ActionCard title="토너먼트 목록" description="예정된 대회와 하이라이트 흐름을 확인합니다." to="/match/tournament" />
          <ActionCard title="내 신청 현황" description="신청한 경기, 모집, 팀 참가 상태를 확인합니다." to="/match/applications" />
        </div>
      </Section>
      <Section title="추천 매치">
        <div className="grid">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </Section>
    </>
  )
}

export function MatchJoinPage() {
  return (
    <>
      <PageHeader title="참여하기" description="개인, 팀, 게스트 참가 방식을 선택합니다." backTo="/match" />
      <div className="grid grid--three">
        <ActionCard title="개인 참가" description="조건에 맞는 공개 매치에 바로 신청합니다." to="/match/join/solo" />
        <ActionCard title="팀 참가" description="소속 팀 정보와 함께 매치를 신청합니다." to="/match/join/team" />
        <ActionCard title="용병/게스트" description="모집글을 보고 임시 팀원으로 참여합니다." to="/match/join/guest" />
      </div>
    </>
  )
}

export function MatchCreatePage() {
  return (
    <>
      <PageHeader title="만들기" description="팀, 모집, 경기 생성을 시작하는 화면입니다." backTo="/match" />
      <div className="grid grid--three">
        <ActionCard title="팀 만들기" description="팀명, 지역, 소개를 입력하는 흐름입니다." to="/match/create/team" />
        <ActionCard title="용병/게스트 모집" description="필요 인원과 역할을 등록합니다." to="/match/create/recruit" />
        <ActionCard title="선택 경기 생성" description="필드와 일정을 선택해 경기를 생성합니다." to="/match/create/game" />
      </div>
    </>
  )
}

interface SimpleMatchFlowPageProps {
  title: string
  description: string
  backTo: string
  cards: Array<{ title: string; description: string; to?: string }>
}

export function SimpleMatchFlowPage({ title, description, backTo, cards }: SimpleMatchFlowPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} backTo={backTo} />
      <div className="grid">
        {cards.map((card) => (
          <ActionCard key={card.title} title={card.title} description={card.description} to={card.to ?? '/match'} />
        ))}
      </div>
    </>
  )
}

export function TournamentPage() {
  return (
    <>
      <PageHeader title="토너먼트" description="토너먼트 목록과 상세 진입을 확인하는 화면입니다." backTo="/match" />
      <div className="grid">
        {matches.slice(0, 2).map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </>
  )
}

export function ApplicationsPage() {
  return (
    <>
      <PageHeader title="내 신청 현황" description="내가 신청한 경기, 모집, 팀 참가 상태를 확인합니다." backTo="/match" />
      <div className="grid">
        {mySchedules.map((schedule) => (
          <MatchCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </>
  )
}

export function MatchDetailPage() {
  const { matchId } = useParams()
  const match = matches.find((item) => item.id === matchId)
  const joinedMatchIds = useAppStore((state) => state.joinedMatchIds)
  const toggleMatchJoin = useAppStore((state) => state.toggleMatchJoin)

  if (!match) {
    return (
      <>
        <PageHeader title="경기상세" description="선택한 경기를 찾을 수 없습니다." backTo="/match" />
        <EmptyState />
      </>
    )
  }

  const isJoined = joinedMatchIds.includes(match.id)

  return (
    <>
      <PageHeader title={match.title} description={match.description} backTo="/match" />
      <MatchCard match={match} />
      <Section title="경기상세 하위 정보">
        <div className="grid grid--two">
          <ActionCard title="필드 정보" description="주소, 시설, 안전 규칙을 확인합니다." to={`/match/${match.id}/field`} />
          <ActionCard title="장비 렌탈" description="보호구와 렌탈 장비 가능 여부를 확인합니다." to={`/match/${match.id}/rental`} />
          <ActionCard title="예약/신청" description="참가 신청 상태와 준비물을 확인합니다." to={`/match/${match.id}/apply`} />
          <ActionCard title="채팅방" description="참가자 공지와 질문을 확인합니다." to={`/match/${match.id}/chat`} />
        </div>
      </Section>
      <Card>
        <h3>로컬 상태 예시</h3>
        <p>이 버튼은 zustand persist로 localStorage에 신청 상태를 저장합니다.</p>
        <button className="button button--primary" type="button" onClick={() => toggleMatchJoin(match.id)}>
          {isJoined ? '신청 취소 상태로 변경' : '신청 상태로 변경'}
        </button>
      </Card>
    </>
  )
}

interface MatchSubPageProps {
  type: 'field' | 'rental' | 'apply' | 'chat'
}

const matchSubCopy = {
  field: ['필드 정보', '경기장의 시설, 위치, 안전 브리핑 정보를 확인합니다.'],
  rental: ['장비 렌탈', '보호구, 탄속 측정, 렌탈 장비 정보를 확인합니다.'],
  apply: ['예약/신청', '참가 조건, 신청 상태, 준비물을 확인합니다.'],
  chat: ['채팅방', '참가자 공지와 질문이 오가는 더미 채팅 화면입니다.'],
} satisfies Record<MatchSubPageProps['type'], [string, string]>

export function MatchSubPage({ type }: MatchSubPageProps) {
  const { matchId } = useParams()
  const match = matches.find((item) => item.id === matchId)
  const [title, description] = matchSubCopy[type]

  return (
    <>
      <PageHeader title={title} description={description} backTo={matchId ? `/match/${matchId}` : '/match'} />
      <Card>
        <h3>{match?.title ?? '선택 경기'}</h3>
        <p>{match?.fieldName ?? '필드 정보가 아직 연결되지 않았습니다.'}</p>
      </Card>
      {type === 'chat' ? <EmptyState title="아직 채팅 메시지가 없습니다" /> : null}
    </>
  )
}

export function RecruitListPage() {
  return (
    <>
      <PageHeader title="용병/게스트 모집" description="현재 열린 모집글을 확인합니다." backTo="/match" />
      <div className="grid">
        {recruitPosts.map((recruit) => (
          <RecruitCard key={recruit.id} recruit={recruit} />
        ))}
      </div>
    </>
  )
}
