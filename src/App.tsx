import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from './components'
import { BeginnerBoardPage, BoardIndexPage, BoardPage, ChatPage, CommunityPage } from './pages/CommunityPages'
import { CreatorListPage, CreatorPage } from './pages/CreatorPages'
import { HomePage } from './pages/HomePage'
import {
  ApplicationsPage,
  MatchCreatePage,
  MatchDetailPage,
  MatchJoinPage,
  MatchPage,
  MatchSubPage,
  RecruitListPage,
  SimpleMatchFlowPage,
  TournamentPage,
} from './pages/MatchPages'
import { MyPage, MySimplePage } from './pages/MyPages'
import './App.css'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/match', element: <MatchPage /> },
      { path: '/match/join', element: <MatchJoinPage /> },
      {
        path: '/match/join/solo',
        element: (
          <SimpleMatchFlowPage
            title="개인 참가"
            description="혼자 참가 가능한 매치 신청 흐름입니다."
            backTo="/match/join"
            cards={[
              { title: '추천 개인 매치', description: '초보 환영 야외전 신청 카드입니다.', to: '/match/match-001' },
              { title: '참가 전 체크', description: '안전수칙과 준비물 확인 단계입니다.', to: '/match/match-001/apply' },
            ]}
          />
        ),
      },
      {
        path: '/match/join/team',
        element: (
          <SimpleMatchFlowPage
            title="팀 참가"
            description="소속 팀 기준으로 경기 참가를 신청합니다."
            backTo="/match/join"
            cards={[
              { title: '팀 정보 확인', description: '팀 대표와 참가 인원 정보를 확인합니다.', to: '/my/team' },
              { title: '팀 매치 신청', description: '팀 단위 신청 가능한 경기를 선택합니다.', to: '/match/match-002' },
            ]}
          />
        ),
      },
      { path: '/match/join/guest', element: <RecruitListPage /> },
      { path: '/match/create', element: <MatchCreatePage /> },
      {
        path: '/match/create/team',
        element: (
          <SimpleMatchFlowPage
            title="팀 만들기"
            description="팀명, 지역, 소개를 입력하는 생성 흐름입니다."
            backTo="/match/create"
            cards={[{ title: '팀 기본 정보', description: '팀명, 활동 지역, 소개 문구를 준비합니다.', to: '/my/team' }]}
          />
        ),
      },
      { path: '/match/create/recruit', element: <RecruitListPage /> },
      {
        path: '/match/create/game',
        element: (
          <SimpleMatchFlowPage
            title="선택 경기 생성"
            description="필드, 시간, 참가 조건을 선택하는 더미 생성 화면입니다."
            backTo="/match/create"
            cards={[{ title: '경기 조건 입력', description: '일정, 필드, 정원, 레벨 조건을 설정합니다.', to: '/match' }]}
          />
        ),
      },
      { path: '/match/tournament', element: <TournamentPage /> },
      { path: '/match/applications', element: <ApplicationsPage /> },
      { path: '/match/:matchId', element: <MatchDetailPage /> },
      { path: '/match/:matchId/field', element: <MatchSubPage type="field" /> },
      { path: '/match/:matchId/rental', element: <MatchSubPage type="rental" /> },
      { path: '/match/:matchId/apply', element: <MatchSubPage type="apply" /> },
      { path: '/match/:matchId/chat', element: <MatchSubPage type="chat" /> },
      { path: '/creator', element: <CreatorPage /> },
      { path: '/creator/live', element: <CreatorListPage type="live" /> },
      { path: '/creator/mvp-vote', element: <CreatorListPage type="mvp" /> },
      { path: '/creator/posts', element: <CreatorListPage type="posts" /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/community/beginner', element: <BeginnerBoardPage /> },
      { path: '/community/board', element: <BoardIndexPage /> },
      {
        path: '/community/board/team',
        element: <BoardPage title="팀게시판" description="팀별 공지와 일정 공유 게시판입니다." category="team" />,
      },
      {
        path: '/community/board/recruit',
        element: <BoardPage title="팀원 모집" description="같이 뛸 팀원을 찾는 게시판입니다." category="recruit" />,
      },
      {
        path: '/community/board/reviews',
        element: <BoardPage title="경기후기" description="참가 경험과 필드 후기를 공유합니다." category="reviews" />,
      },
      { path: '/community/chat', element: <ChatPage /> },
      { path: '/my', element: <MyPage /> },
      { path: '/my/profile', element: <MySimplePage type="profile" /> },
      { path: '/my/badges', element: <MySimplePage type="badges" /> },
      { path: '/my/team', element: <MySimplePage type="team" /> },
      { path: '/my/schedule', element: <MySimplePage type="schedule" /> },
      { path: '/my/history', element: <MySimplePage type="history" /> },
      { path: '/my/mentoring', element: <MySimplePage type="mentoring" /> },
      { path: '/my/posts', element: <MySimplePage type="posts" /> },
      { path: '/my/creator', element: <MySimplePage type="creator" /> },
      { path: '/my/settings', element: <MySimplePage type="settings" /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
