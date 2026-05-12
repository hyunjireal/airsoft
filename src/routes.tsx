import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { ScrollToTop } from './layout/ScrollToTop'
import { GuestStart } from './pages/auth/GuestStart'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ChatbotPage } from './pages/chat/ChatbotPage'
import { Notifications } from './pages/common/Notifications'
import { NotFound } from './pages/common/NotFound'
import { Search } from './pages/common/Search'
import { BeginnerBoard } from './pages/community/BeginnerBoard'
import { BeginnerQuestionDetail } from './pages/community/BeginnerQuestionDetail'
import { BeginnerRecentQuestions } from './pages/community/BeginnerRecentQuestions'
import { BoardList } from './pages/community/BoardList'
import { CommunityHome } from './pages/community/CommunityHome'
import { PostCreate } from './pages/community/PostCreate'
import { PostDetail } from './pages/community/PostDetail'
import { MediaHome } from './pages/media/MediaHome'
import { MediaList } from './pages/media/MediaList'
import { MediaProfile } from './pages/media/MediaProfile'
import { GuideComplete } from './pages/guide/GuideComplete'
import { GuideQuiz } from './pages/guide/GuideQuiz'
import { GuideStepPage } from './pages/guide/GuideStepPage'
import { Home } from './pages/home/Home'
import { MatchApply } from './pages/match/MatchApply'
import { MatchApplyComplete } from './pages/match/MatchApplyComplete'
import { FieldInfo } from './pages/match/FieldInfo'
import { MatchCreateGame } from './pages/match/MatchCreateGame'
import { MatchCreateHome } from './pages/match/MatchCreateHome'
import { MatchDetail } from './pages/match/MatchDetail'
import { MatchFilter } from './pages/match/MatchFilter'
import { MatchGuestJoinCreate } from './pages/match/MatchGuestJoinCreate'
import { MatchGuestWantedCreate } from './pages/match/MatchGuestWantedCreate'
import { MatchHome } from './pages/match/MatchHome'
import { MatchJoinHome } from './pages/match/MatchJoinHome'
import { MatchList } from './pages/match/MatchList'
import { MatchManageHome } from './pages/match/MatchManageHome'
import { MatchScheduleJoin } from './pages/match/MatchScheduleJoin'
import { TeamMatchApply } from './pages/match/TeamMatchApply'
import { TeamMatchDetail } from './pages/match/TeamMatchDetail'
import { TeamMatchJoinList } from './pages/match/TeamMatchJoinList'
import { MyApplications } from './pages/my/MyApplications'
import { MyMatches } from './pages/my/MyMatches'
import { MyPage } from './pages/my/MyPage'
import { PointShop } from './pages/my/PointShop'
import { MyPosts } from './pages/my/MyPosts'
import { MySchedule } from './pages/my/MySchedule'
import { NotificationSettings } from './pages/my/NotificationSettings'
import { ProfileEdit } from './pages/my/ProfileEdit'
import { Onboarding } from './pages/onboarding'
import { AiAnswerPreview } from './pages/question/AiAnswerPreview'
import { QuestionCategory } from './pages/question/QuestionCategory'
import { QuestionComplete } from './pages/question/QuestionComplete'
import { QuestionStart } from './pages/question/QuestionStart'
import { QuestionWrite } from './pages/question/QuestionWrite'
import { SimilarQuestions } from './pages/question/SimilarQuestions'
import { HighlightDetail } from './pages/tournament/HighlightDetail'
import { HighlightList } from './pages/tournament/HighlightList'
import { MvpVote } from './pages/tournament/MvpVote'
import { MvpVoteComplete } from './pages/tournament/MvpVoteComplete'
import { Ranking } from './pages/tournament/Ranking'
import { TournamentHome } from './pages/tournament/TournamentHome'
import { MercenaryCreate } from './pages/team/MercenaryCreate'
import { MercenaryDetail } from './pages/team/MercenaryDetail'
import { MercenaryHome } from './pages/team/MercenaryHome'
import { MercenaryList } from './pages/team/MercenaryList'
import { TeamCreate } from './pages/team/TeamCreate'
import { TeamDetail } from './pages/team/TeamDetail'
import { TeamHome } from './pages/team/TeamHome'
import { TeamList } from './pages/team/TeamList'

export const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollToTop />
        <Outlet />
      </>
    ),
    children: [
      {
        children: [
          { path: '/', element: <Onboarding /> },
          { path: '/onboarding', element: <Onboarding /> },
          { path: '/login', element: <Login /> },
          { path: '/signup', element: <Signup /> },
          { path: '/guest-start', element: <GuestStart /> },
        ],
      },
      {
        element: <AppShell />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/guide', element: <Navigate to="/guide/safety" replace /> },
          { path: '/guide/safety', element: <GuideStepPage stepId="safety-gear" /> },
          { path: '/guide/rules', element: <GuideStepPage stepId="safe-zone" /> },
          { path: '/guide/gear', element: <GuideStepPage stepId="in-game" /> },
          { path: '/guide/terms', element: <GuideStepPage stepId="danger" /> },
          { path: '/guide/etiquette', element: <GuideStepPage stepId="law" /> },
          { path: '/guide/manner', element: <GuideStepPage stepId="manner" /> },
          { path: '/guide/checklist', element: <GuideStepPage stepId="checklist" /> },
          { path: '/guide/quiz', element: <GuideQuiz /> },
          { path: '/guide/complete', element: <GuideComplete /> },
          { path: '/question', element: <QuestionStart /> },
          { path: '/question/category', element: <QuestionCategory /> },
          { path: '/question/write', element: <QuestionWrite /> },
          { path: '/question/similar', element: <SimilarQuestions /> },
          { path: '/question/ai-preview', element: <AiAnswerPreview /> },
          { path: '/question/complete', element: <QuestionComplete /> },
          { path: '/match', element: <MatchHome /> },
          { path: '/match/join', element: <MatchJoinHome /> },
          { path: '/match/join/team', element: <TeamMatchJoinList /> },
          { path: '/match/join/team/:teamMatchId', element: <TeamMatchDetail /> },
          { path: '/match/join/team/:teamMatchId/apply', element: <TeamMatchApply /> },
          { path: '/match/create', element: <MatchCreateHome /> },
          { path: '/match/create/guest-join', element: <MatchGuestJoinCreate /> },
          { path: '/match/create/guest-wanted', element: <MatchGuestWantedCreate /> },
          { path: '/match/create/game', element: <MatchCreateGame /> },
          { path: '/match/manage', element: <MatchManageHome /> },
          { path: '/match/fields', element: <FieldInfo /> },
          { path: '/match/list', element: <MatchList /> },
          { path: '/match/filter', element: <MatchFilter /> },
          { path: '/match/schedule/:matchId/join', element: <MatchScheduleJoin /> },
          { path: '/match/:id', element: <MatchDetail /> },
          { path: '/match/:id/apply', element: <MatchApply /> },
          { path: '/match/:id/complete', element: <MatchApplyComplete /> },
          { path: '/team', element: <TeamHome /> },
          { path: '/team/list', element: <TeamList /> },
          { path: '/team/create', element: <TeamCreate /> },
          { path: '/team/:id', element: <TeamDetail /> },
          { path: '/mercenary', element: <MercenaryHome /> },
          { path: '/mercenary/list', element: <MercenaryList /> },
          { path: '/mercenary/create', element: <MercenaryCreate /> },
          { path: '/mercenary/:id', element: <MercenaryDetail /> },
          {
            path: '/community',
            element: <CommunityHome />,
            children: [
              { index: true, element: <BeginnerBoard /> },
              { path: 'free', element: <BoardList /> },
            ],
          },
          {
            path: '/community/beginner',
            children: [
              { index: true, element: <Navigate to="/community" replace /> },
              { path: 'recent', element: <BeginnerRecentQuestions /> },
              { path: 'recent/first', element: <BeginnerQuestionDetail /> },
            ],
          },
          { path: '/community/post/create', element: <PostCreate /> },
          { path: '/community/post/:id', element: <PostDetail /> },
          { path: '/community/:boardType', element: <BoardList /> },
          { path: '/media', element: <MediaHome /> },
          { path: '/media/list', element: <MediaList /> },
          { path: '/media/:mediaId', element: <MediaProfile /> },
          { path: '/tournament', element: <TournamentHome /> },
          { path: '/tournament/highlights', element: <HighlightList /> },
          { path: '/tournament/highlights/:id', element: <HighlightDetail /> },
          { path: '/tournament/mvp-vote', element: <MvpVote /> },
          { path: '/tournament/mvp-complete', element: <MvpVoteComplete /> },
          { path: '/tournament/ranking', element: <Ranking /> },
          { path: '/chat', element: <ChatbotPage /> },
          { path: '/my', element: <MyPage /> },
          { path: '/my/point-shop', element: <PointShop /> },
          { path: '/my/matches', element: <MyMatches /> },
          { path: '/my/profile', element: <ProfileEdit /> },
          { path: '/my/schedule', element: <MySchedule /> },
          { path: '/my/applications', element: <MyApplications /> },
          { path: '/my/posts', element: <MyPosts /> },
          { path: '/my/notifications', element: <NotificationSettings /> },
          { path: '/search', element: <Search /> },
          { path: '/notifications', element: <Notifications /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
