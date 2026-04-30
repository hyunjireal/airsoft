import { ActionCard, CreatorCard, PageHeader, Section } from '../components'
import { creatorContents, mvpCandidates } from '../data/creators'

export function CreatorPage() {
  return (
    <>
      <PageHeader title="크리에이터" description="라이브, MVP 투표, 게시물 콘텐츠를 확인합니다." />
      <Section title="라이브 / 미디어 콘텐츠">
        <div className="grid">
          {creatorContents.map((content) => (
            <CreatorCard key={content.id} content={content} />
          ))}
        </div>
      </Section>
      <Section title="MVP 투표">
        <div className="grid">
          {mvpCandidates.map((candidate) => (
            <CreatorCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      </Section>
      <Section title="크리에이터 게시물">
        <div className="grid grid--three">
          <ActionCard title="라이브 보기" description="현재 진행 중인 라이브 더미 목록입니다." to="/creator/live" />
          <ActionCard title="MVP 투표" description="대회 하이라이트 후보에게 투표합니다." to="/creator/mvp-vote" />
          <ActionCard title="게시물" description="장비 리뷰와 경기 해설을 모아봅니다." to="/creator/posts" />
        </div>
      </Section>
    </>
  )
}

export function CreatorListPage({ type }: { type: 'live' | 'mvp' | 'posts' }) {
  const copy = {
    live: ['라이브 / 미디어', '라이브 중, 업로드됨, 예정 콘텐츠를 확인합니다.'],
    mvp: ['MVP 투표', '후보자 카드와 더미 득표율을 확인합니다.'],
    posts: ['크리에이터 게시물', '글, 영상 소개, 장비 리뷰, 경기 해설 콘텐츠입니다.'],
  } as const
  const [title, description] = copy[type]

  return (
    <>
      <PageHeader title={title} description={description} backTo="/creator" />
      <div className="grid">
        {type === 'mvp'
          ? mvpCandidates.map((candidate) => <CreatorCard key={candidate.id} candidate={candidate} />)
          : creatorContents.map((content) => <CreatorCard key={content.id} content={content} />)}
      </div>
    </>
  )
}
