import { ActionCard, CreatorCard, MatchCard, PageHeader, PostCard, ProfileSummary, RecruitCard, Section } from '../components'
import { creatorContents } from '../data/creators'
import { matches, recruitPosts } from '../data/matches'
import { communityPosts } from '../data/posts'
import { badges, teams } from '../data/teams'
import { currentUser, mySchedules } from '../data/user'

export function HomePage() {
  const userTeam = teams.find((team) => team.id === currentUser.teamId)
  const userBadges = badges.filter((badge) => currentUser.badgeIds.includes(badge.id))

  return (
    <>
      <PageHeader
        title="에어소프트건"
        description="내 일정, 추천 매치, 커뮤니티 흐름을 한 화면에서 확인합니다."
      />

      <Section title="내 상태 요약" description="이번 주 참여 가능 상태와 입문 진행률입니다.">
        <ProfileSummary user={currentUser} team={userTeam} badges={userBadges} />
        <div className="grid grid--three">
          <ActionCard title="이번 주 참여 가능" description="토요일 오후 매치 참여 가능으로 표시되어 있습니다." to="/my/schedule" />
          <ActionCard title="내 소속 팀" description={`${userTeam?.name ?? '미가입'} 팀 정보를 확인합니다.`} to="/my/team" />
          <ActionCard title="초보 가이드" description={`진행률 ${currentUser.beginnerGuideProgress}% 이어하기`} to="/my/badges" />
        </div>
      </Section>

      <Section title="내 경기 일정">
        <div className="grid">
          {mySchedules.map((schedule) => (
            <MatchCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </Section>

      <Section title="추천 경기/모집" description="레벨, 지역, 참여 성향에 맞춘 더미 추천입니다.">
        <div className="grid">
          {matches.slice(0, 2).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
          {recruitPosts.map((recruit) => (
            <RecruitCard key={recruit.id} recruit={recruit} />
          ))}
        </div>
      </Section>

      <Section title="버디 매칭">
        <ActionCard
          title="같이 갈 버디를 찾아볼까요?"
          description="혼자 참여하는 사용자를 위해 같은 지역의 초보/멘토를 연결합니다."
          to="/match/join/guest"
          cta="버디 찾기"
        />
      </Section>

      <Section title="초보자 퀴즈 이어하기">
        <ActionCard
          title="안전수칙과 경기 매너 퀴즈"
          description="렌탈 장비 사용법과 필드 안전거리 내용을 이어서 확인합니다."
          to="/my/badges"
          cta="이어하기"
        />
      </Section>

      <Section title="인기 질문/팁">
        <div className="grid">
          {communityPosts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      <Section title="라이브/하이라이트 미리보기">
        <div className="grid">
          {creatorContents.slice(0, 2).map((content) => (
            <CreatorCard key={content.id} content={content} />
          ))}
        </div>
      </Section>
    </>
  )
}
