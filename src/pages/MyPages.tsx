import { ActionCard, EmptyState, MatchCard, PageHeader, ProfileSummary, Section } from '../components'
import { creatorContents } from '../data/creators'
import { communityPosts } from '../data/posts'
import { badges, teams } from '../data/teams'
import { currentUser, mySchedules } from '../data/user'
import { useAppStore } from '../stores/useAppStore'

export function MyPage() {
  const team = teams.find((item) => item.id === currentUser.teamId)
  const userBadges = badges.filter((badge) => currentUser.badgeIds.includes(badge.id))

  return (
    <>
      <PageHeader title="마이" description="내 프로필, 일정, 게시물, 설정 흐름을 확인합니다." />
      <Section title="My Profile">
        <ProfileSummary user={currentUser} team={team} badges={userBadges} />
        <div className="grid grid--two">
          <ActionCard title="내 레벨/배지" description="안전수칙, 참가 이력 기반 배지입니다." to="/my/badges" />
          <ActionCard title="가입한 팀" description="소속 팀과 팀원 정보를 확인합니다." to="/my/team" />
        </div>
      </Section>
      <Section title="내 경기 일정">
        <div className="grid grid--two">
          <ActionCard title="일정" description="앞으로 참가할 경기를 확인합니다." to="/my/schedule" />
          <ActionCard title="이력" description="참가했던 경기 히스토리입니다." to="/my/history" />
        </div>
      </Section>
      <Section title="관리">
        <div className="grid grid--two">
          <ActionCard title="멘토링 설정" description="멘토링을 받을지, 멘토로 참여할지 설정합니다." to="/my/mentoring" />
          <ActionCard title="게시물 관리" description="작성한 글, 댓글, 후기를 관리합니다." to="/my/posts" />
          <ActionCard title="크리에이터 관리" description="팔로우와 내 콘텐츠 관리 화면입니다." to="/my/creator" />
          <ActionCard title="앱 설정" description="알림, 계정, 안전 가이드를 확인합니다." to="/my/settings" />
        </div>
      </Section>
    </>
  )
}

export function MySimplePage({ type }: { type: 'profile' | 'badges' | 'team' | 'schedule' | 'history' | 'mentoring' | 'posts' | 'creator' | 'settings' }) {
  const followedCreatorIds = useAppStore((state) => state.followedCreatorIds)
  const copy = {
    profile: ['My Profile', '닉네임, 레벨, 배지, 소속 팀을 확인합니다.'],
    badges: ['내 레벨/배지', '입문 진행률과 안전 관련 배지를 확인합니다.'],
    team: ['가입한 팀', '소속 팀 정보와 활동 지역을 확인합니다.'],
    schedule: ['내 경기 일정', '앞으로 참가할 경기 일정을 확인합니다.'],
    history: ['경기 이력', '지난 경기와 후기 작성 상태를 확인합니다.'],
    mentoring: ['멘토링 설정', '초보 멘토링 수신 또는 멘토 참여 여부를 설정합니다.'],
    posts: ['게시물 관리', '내가 작성한 글, 댓글, 후기를 관리합니다.'],
    creator: ['크리에이터 관리', '팔로우한 크리에이터와 내 콘텐츠를 확인합니다.'],
    settings: ['앱 설정', '알림, 계정, 안전 가이드 다시 보기 설정입니다.'],
  } as const
  const [title, description] = copy[type]

  return (
    <>
      <PageHeader title={title} description={description} backTo="/my" />
      {type === 'schedule' ? (
        <div className="grid">
          {mySchedules.map((schedule) => (
            <MatchCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      ) : type === 'posts' ? (
        <div className="grid">
          {communityPosts.filter((post) => post.author === currentUser.nickname).map((post) => (
            <ActionCard key={post.id} title={post.title} description="작성한 게시물 관리 더미 카드입니다." to="/community" />
          ))}
        </div>
      ) : type === 'creator' ? (
        <div className="grid">
          {creatorContents
            .filter((content) => followedCreatorIds.includes(content.id))
            .map((content) => (
              <ActionCard key={content.id} title={content.title} description={`${content.creator} 팔로우 중`} to="/creator" />
            ))}
        </div>
      ) : type === 'history' ? (
        <EmptyState title="아직 완료된 경기 이력이 없습니다" />
      ) : (
        <div className="grid">
          <ActionCard title={title} description="세부 입력 폼은 추후 API와 디자인 반영 단계에서 연결합니다." to="/my" cta="마이로 돌아가기" />
        </div>
      )}
    </>
  )
}
