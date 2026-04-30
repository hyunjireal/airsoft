import { ActionCard, EmptyState, PageHeader, PostCard, Section } from '../components'
import { communityPosts } from '../data/posts'
import type { CommunityPost } from '../types'

export function CommunityPage() {
  return (
    <>
      <PageHeader title="커뮤니티" description="초보 질문, 일반 게시판, 실시간 채팅 흐름을 확인합니다." />
      <Section title="초보 질문방">
        <div className="grid">
          {communityPosts.filter((post) => post.category === 'beginner').map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>
      <Section title="일반 게시판">
        <div className="grid grid--three">
          <ActionCard title="팀게시판" description="팀별 공지와 일정 공유 게시판입니다." to="/community/board/team" />
          <ActionCard title="팀원 모집" description="같이 뛸 팀원을 찾는 게시판입니다." to="/community/board/recruit" />
          <ActionCard title="경기후기" description="참가 경험과 필드 후기를 공유합니다." to="/community/board/reviews" />
        </div>
      </Section>
      <Section title="실시간 채팅">
        <div className="grid">
          <ActionCard title="이번 주말 수도권 매치방" description="현재 24명이 대화 중입니다." to="/community/chat" />
          <ActionCard title="초보 환영 Q&A방" description="장비와 안전수칙 질문을 나눕니다." to="/community/chat" />
        </div>
      </Section>
    </>
  )
}

export function BeginnerBoardPage() {
  return <BoardPage title="초보 질문방" description="부담 없이 첫 참가와 장비 질문을 남기는 공간입니다." category="beginner" />
}

export function BoardIndexPage() {
  return (
    <>
      <PageHeader title="일반 게시판" description="팀게시판, 팀원 모집, 경기후기 카테고리입니다." backTo="/community" />
      <div className="grid grid--three">
        <ActionCard title="팀게시판" description="팀 일정과 공지 공유" to="/community/board/team" />
        <ActionCard title="팀원 모집" description="새 팀원과 게스트 모집" to="/community/board/recruit" />
        <ActionCard title="경기후기" description="필드와 경기 경험 공유" to="/community/board/reviews" />
      </div>
    </>
  )
}

export function BoardPage({
  title,
  description,
  category,
}: {
  title: string
  description: string
  category: CommunityPost['category']
}) {
  const posts = communityPosts.filter((post) => post.category === category)

  return (
    <>
      <PageHeader title={title} description={description} backTo="/community" />
      {posts.length > 0 ? (
        <div className="grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  )
}

export function ChatPage() {
  return (
    <>
      <PageHeader title="실시간 채팅" description="활성화된 채팅방 리스트와 더미 입장 흐름입니다." backTo="/community" />
      <div className="grid">
        <ActionCard title="이번 주말 수도권 매치방" description="매치 전 준비물과 집결 시간을 공유합니다." to="/community/chat" />
        <ActionCard title="초보 환영 Q&A방" description="첫 참가자가 질문하기 좋은 공개 채팅방입니다." to="/community/chat" />
      </div>
    </>
  )
}
