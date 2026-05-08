import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkIcon from "../../asset/icons/com_bookmark.svg";
import bookmarkOnIcon from "../../asset/icons/com_bookmark_on.svg";
import chatSmallIcon from "../../asset/icons/com_chat02.svg";
import eyesIcon from "../../asset/icons/com_eyes.svg";
import aiIcon from "../../asset/icons/com_ai.svg";
import safetyIcon from "../../asset/icons/com_safety.svg";
import sendIcon from "../../asset/icons/com_send.svg";
import writeIcon from "../../asset/icons/com_write.svg";
import beginnerGuideBookImage from "../../asset/images/com_beginner_card_book.png";
import beginnerGuideQuestionImage from "../../asset/images/com_beginner_card_question.png";
import CategoryTag from "../../components/CategoryTag";
import More from "../../components/More";
import "./Community.css";

const categoryTabs = [
  "전체",
  "법규/규정",
  "장비",
  "안전",
  "게임/전술",
  "수리/튜닝",
] as const;

type CategoryTab = (typeof categoryTabs)[number];

type QuestionCategory = Exclude<CategoryTab, "전체">;

type RecentQuestion = {
  id: string;
  title: string;
  category: QuestionCategory;
  author: string;
  time: string;
  views: string;
  comments: string;
  recommended?: boolean;
};

const quickQuestions = [
  "초보가 먼저 알아야 할 것",
  "맞으면 어떻게 해?",
  "필드 규칙 알려줘",
];

const recentQuestions: RecentQuestion[] = [
  {
    id: "q-001",
    title: "서바이벌 게임에서 꼭 지켜야 할 기본 규칙이 궁금해요!",
    category: "법규/규정",
    author: "진짜초보",
    time: "2시간 전",
    views: "999+",
    comments: "567",
    recommended: true,
  },
  {
    id: "q-002",
    title: "처음 가는 필드에서는 어떤 장비를 우선으로 준비하면 좋나요?",
    category: "장비",
    author: "게임마스터",
    time: "1시간 전",
    views: "150",
    comments: "120",
  },
  {
    id: "q-003",
    title: "팀플레이 입문자가 알아두면 좋은 기본 전술 팁이 있을까요?",
    category: "게임/전술",
    author: "전술고수",
    time: "30분 전",
    views: "200",
    comments: "150",
  },
  {
    id: "q-004",
    title: "보호장비는 어느 정도까지 챙겨야 안전하게 즐길 수 있나요?",
    category: "안전",
    author: "에솦러",
    time: "4시간 전",
    views: "188",
    comments: "42",
  },
];

const questionCategoryToneClass: Record<QuestionCategory, string> = {
  "법규/규정": "is-rules",
  장비: "is-equipment",
  안전: "is-safety",
  "게임/전술": "is-tactics",
  "수리/튜닝": "is-custom",
};

function chatQuestionUrl(question: string) {
  return `/chat?question=${encodeURIComponent(question)}`;
}

export function BeginnerBoard() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("전체");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set([recentQuestions[0]?.id].filter(Boolean)),
  );
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiFocused, setAiFocused] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (activeCategory === "전체") {
      return recentQuestions;
    }

    return recentQuestions.filter(
      (question) => question.category === activeCategory,
    );
  }, [activeCategory]);

  const askGai = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    navigate(chatQuestionUrl(trimmed));
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarkedIds((current) => {
      const next = new Set(current);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  return (
    <div
      className="beginner_board_page"
      style={{
        marginTop: "-140px",
        paddingTop: "120px",
        background: "linear-gradient(180deg, #E5EAD7 0 240px, #FFFFFF 240px)",
      }}
    >
      <section className="beginner_hero" aria-label="초보 질문방 소개">
        <div className="beginner_hero_content">
          <span className="beginner_hero_badge">
            <img src={safetyIcon} alt="" />
            입문자 전용 Q&A
          </span>

          <h1>초보 질문방</h1>

          <form
            className={`beginner_ai_search ${aiFocused || aiQuestion ? "is_active" : ""}`}
            aria-label="가이에게 질문하기"
            onSubmit={(event) => {
              event.preventDefault();
              askGai(aiQuestion);
            }}
          >
            <span className="beginner_ai_search_left">
              <img src={aiIcon} alt="" />
              <input
                type="search"
                value={aiQuestion}
                onFocus={() => setAiFocused(true)}
                onBlur={() => setAiFocused(false)}
                onChange={(event) => setAiQuestion(event.target.value)}
                placeholder="가이에게 물어보세요"
              />
            </span>
            <button
              className="beginner_ai_search_send"
              type="submit"
              aria-label="질문 보내기"
            >
              <img src={sendIcon} alt="" />
            </button>
          </form>

          <div className="beginner_hero_bottom">
            <p className="beginner_hero_prompt">추천 질문</p>
            <div className="beginner_hashtags" aria-label="추천 질문">
              {quickQuestions.map((question) => (
                <button
                  className="beginner_hashtag_button"
                  type="button"
                  key={question}
                  onClick={() => askGai(question)}
                >
                  <CategoryTag className="beginner_hashtag">
                    {question}
                  </CategoryTag>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="beginner_hero_art" aria-hidden="true" />
      </section>

      <div className="beginner_body">
        <section className="beginner_start_section">
          <h2 className="beginner_start_title">
            처음이라면
            <br />
            이렇게 시작해보세요
          </h2>

          <div className="beginner_guide_inner">
            <button
              className="beginner_start_card beginner_start_card_light beginner_start_card_book"
              type="button"
              onClick={() => navigate("/guide")}
            >
              <div className="beginner_start_text">
                <h3>초보자 가이드</h3>
                <p>기본 규칙, 안전수칙, 용어를 먼저 익혀보세요.</p>
              </div>
              <span
                className="beginner_start_icon_shell beginner_start_icon_shell_book"
                aria-hidden="true"
              >
                <img
                  className="beginner_start_icon beginner_start_icon_book"
                  src={beginnerGuideBookImage}
                  alt=""
                />
              </span>
            </button>

            <button
              className="beginner_start_card beginner_start_card_blue beginner_start_card_question"
              type="button"
              onClick={() => navigate("/community/beginner/recent")}
            >
              <div className="beginner_start_text">
                <h3>자주 묻는 질문</h3>
                <p>많이 물어보는 질문들을 모아두었어요.</p>
              </div>
              <span
                className="beginner_start_icon_shell beginner_start_icon_shell_question"
                aria-hidden="true"
              >
                <img
                  className="beginner_start_icon beginner_start_icon_question"
                  src={beginnerGuideQuestionImage}
                  alt=""
                />
              </span>
            </button>
          </div>
        </section>

        <section className="beginner_questions_section">
          <div className="beginner_question_header">
            <div className="beginner_question_heading">
              <h2>최근 올라온 질문</h2>
              <p>다른 입문자들의 고민과 답변을 확인해보세요</p>
            </div>

            <button
              className="beginner_more_button"
              type="button"
              aria-label="최근 질문 더 보기"
              onClick={() => navigate("/community/beginner/recent")}
            >
              <More className="beginner_more_text" />
            </button>
          </div>

          <div className="beginner_question_inner">
            <div className="beginner_question_tags" aria-label="질문 카테고리">
              {categoryTabs.map((tab) => (
                <button
                  className="beginner_question_tag_button"
                  type="button"
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  aria-pressed={activeCategory === tab}
                >
                  <span
                    className={`beginner_question_chip ${
                      activeCategory === tab
                        ? "is-active"
                        : tab === "전체"
                          ? "is-neutral"
                          : questionCategoryToneClass[tab]
                    }`}
                  >
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            <div className="beginner_question_card_list">
              {filteredQuestions.map((question) => {
                const bookmarked = bookmarkedIds.has(question.id);

                return (
                  <article
                    className="beginner_question_card"
                    key={question.id}
                    onClick={() => navigate("/community/beginner/recent/first")}
                  >
                    <div className="beginner_question_card_header">
                      <div className="beginner_question_labels">
                        <span className="beginner_question_card_category">
                          {question.category}
                        </span>
                      </div>

                      <button
                        className="beginner_question_bookmark"
                        type="button"
                        aria-label={`${question.title} 북마크`}
                        aria-pressed={bookmarked}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleBookmark(question.id);
                        }}
                      >
                        <img
                          src={bookmarked ? bookmarkOnIcon : bookmarkIcon}
                          alt=""
                        />
                      </button>
                    </div>

                    <div className="beginner_question_card_body">
                      <h3 className="beginner_question_card_tit">
                        {question.title}
                      </h3>

                      <div className="beginner_question_info">
                        <span className="beginner_question_author">
                          {question.author} · {question.time}
                        </span>
                        <span className="beginner_question_stats">
                          <span>
                            <img src={eyesIcon} alt="" />
                            {question.views}
                          </span>
                          <span>
                            <img src={chatSmallIcon} alt="" />
                            {question.comments}
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <button
        className="community_write_floating beginner_write_floating"
        type="button"
        aria-label="글 작성하기"
        onClick={() => navigate("/community/post/create")}
      >
        <img src={writeIcon} alt="" />
        <span>글 작성하기</span>
      </button>
    </div>
  );
}
