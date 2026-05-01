import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { GuestStart } from './pages/auth/GuestStart'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { ChatbotPage } from './pages/chat/ChatbotPage'
import { Notifications } from './pages/common/Notifications'
import { NotFound } from './pages/common/NotFound'
import { Search } from './pages/common/Search'
import { BoardList } from './pages/community/BoardList'
import { CommunityHome } from './pages/community/CommunityHome'
import { PostCreate } from './pages/community/PostCreate'
import { PostDetail } from './pages/community/PostDetail'
import { BeginnerHub } from './pages/guide/BeginnerHub'
import { EtiquetteGuide } from './pages/guide/EtiquetteGuide'
import { GearGuide } from './pages/guide/GearGuide'
import { GuideComplete } from './pages/guide/GuideComplete'
import { GuideQuiz } from './pages/guide/GuideQuiz'
import { RuleGuide } from './pages/guide/RuleGuide'
import { SafetyGuide } from './pages/guide/SafetyGuide'
import { TermGuide } from './pages/guide/TermGuide'
import { Home } from './pages/home/Home'
import { MatchApply } from './pages/match/MatchApply'
import { MatchApplyComplete } from './pages/match/MatchApplyComplete'
import { MatchDetail } from './pages/match/MatchDetail'
import { MatchFilter } from './pages/match/MatchFilter'
import { MatchHome } from './pages/match/MatchHome'
import { MatchList } from './pages/match/MatchList'
import { MyApplications } from './pages/my/MyApplications'
import { MyPage } from './pages/my/MyPage'
import { MyPosts } from './pages/my/MyPosts'
import { MySchedule } from './pages/my/MySchedule'
import { NotificationSettings } from './pages/my/NotificationSettings'
import { ProfileEdit } from './pages/my/ProfileEdit'
import { Onboarding } from './pages/Onboarding'
import { AiAnswerPreview } from './pages/question/AiAnswerPreview'
import { QuestionCategory } from './pages/question/QuestionCategory'
import { QuestionComplete } from './pages/question/QuestionComplete'
import { QuestionStart } from './pages/question/QuestionStart'
import { QuestionWrite } from './pages/question/QuestionWrite'
import { SimilarQuestions } from './pages/question/SimilarQuestions'
import { Splash } from './pages/Splash'
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
  { path: '/', element: <Splash /> },
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/guest-start', element: <GuestStart /> },
  {
    element: <AppShell />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/guide', element: <BeginnerHub /> },
      { path: '/guide/safety', element: <SafetyGuide /> },
      { path: '/guide/rules', element: <RuleGuide /> },
      { path: '/guide/gear', element: <GearGuide /> },
      { path: '/guide/terms', element: <TermGuide /> },
      { path: '/guide/etiquette', element: <EtiquetteGuide /> },
      { path: '/guide/quiz', element: <GuideQuiz /> },
      { path: '/guide/complete', element: <GuideComplete /> },
      { path: '/question', element: <QuestionStart /> },
      { path: '/question/category', element: <QuestionCategory /> },
      { path: '/question/write', element: <QuestionWrite /> },
      { path: '/question/similar', element: <SimilarQuestions /> },
      { path: '/question/ai-preview', element: <AiAnswerPreview /> },
      { path: '/question/complete', element: <QuestionComplete /> },
      { path: '/match', element: <MatchHome /> },
      { path: '/match/list', element: <MatchList /> },
      { path: '/match/filter', element: <MatchFilter /> },
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
      { path: '/community', element: <CommunityHome /> },
      { path: '/community/post/create', element: <PostCreate /> },
      { path: '/community/post/:id', element: <PostDetail /> },
      { path: '/community/:boardType', element: <BoardList /> },
      { path: '/tournament', element: <TournamentHome /> },
      { path: '/tournament/highlights', element: <HighlightList /> },
      { path: '/tournament/highlights/:id', element: <HighlightDetail /> },
      { path: '/tournament/mvp-vote', element: <MvpVote /> },
      { path: '/tournament/mvp-complete', element: <MvpVoteComplete /> },
      { path: '/tournament/ranking', element: <Ranking /> },
      { path: '/chat', element: <ChatbotPage /> },
      { path: '/my', element: <MyPage /> },
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
])
