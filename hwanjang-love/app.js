/**
 * 환장연애 (EXChange) — 안전한 치유와 위로의 대나무숲
 * 
 * 주요 기능:
 * 1. 서비스 취지 안내 팝업창 (Intro Modal, 오늘 하루 보지 않기 지원)
 * 2. 매운맛 썰: AI 처방 없이 순수 익명 공감 대나무숲
 * 3. SOS 안전 상담소: 위험 감지 시 긴급 안전 조치 가이드 & 1366/112 연계
 * 4. 사연 작성 폼 & 게시판 탭 완벽 2-Way 실시간 연동 (카테고리 분리 저장 버그 완벽 수정)
 * 5. Supabase DB 연동 & 영구 삭제/수정/댓글 동기화
 */

// ========================================================
// 1. SUPABASE INITIALIZATION & CONFIGURATION
// ========================================================
const SUPABASE_URL = 'https://klymqgnfcxgvjoqitipj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtseW1xZ25mY3hndmpvcWl0aXBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDg4MjcsImV4cCI6MjEwMjY4NDgyN30.LG4zhSSsRKzL6T2EC_TzaApEGcNgdvSWmAw9HVvWE70';

let supabaseClient = null;

function isSupabaseConfigured() {
  return (
    typeof window.supabase !== 'undefined' &&
    SUPABASE_URL &&
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
  );
}

try {
  if (isSupabaseConfigured()) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase Client Initialized successfully.');
  }
} catch (err) {
  console.warn('⚠️ Supabase initialization note:', err);
}

// ========================================================
// 2. SOS SINGLE-MODE SAFETY ACTION GUIDE GENERATOR
// ========================================================
function generateSafetyActionGuide(content) {
  const text = (content || '').toLowerCase();

  // 1. 스토킹 / 도어락 / 집앞 / 미행 / 주거침입
  if (/스토킹|도어락|집앞|미행|서성|찾아와|문두|현관|비밀번호|주거침입/.test(text)) {
    return "🚨 [긴급 신변 보호 조치] 상대방의 반복된 방문이나 주거지 서성임은 명백한 스토킹 범죄(3년 이하 징역 또는 3천만원 이하 벌금)입니다. 절대 문을 열어주거나 단둘이 대면하지 마시고, 즉시 112에 신고하여 '100m 이내 접근금지 및 통신제한 긴급응급조치'를 신청하세요. 여성긴급전화 1366을 통해 임시 안심 숙소 연계 및 CCTV 지원을 받으실 수 있습니다.";
  }

  // 2. 물리적 폭력 / 폭언 / 물건 파손 / 협박
  if (/폭력|때리|폭언|욕|부수|던지|협박|죽여|칼|위협|살해/.test(text)) {
    return "🚨 [폭력 및 신체 위협 경고] 물건 파손이나 폭언은 물리적 상해로 직결되는 중대한 위험 신호입니다. 신체적 안전이 최우선이므로 즉시 안전한 공공장소로 피신하시고 112에 범죄 신고를 접수하세요. 병원 진단서, 멍·상처 사진, 녹음 파일 등 모든 피해 증거를 보존하시고 1366의 무료 법률·의료 지원을 연계받으세요.";
  }

  // 3. 가스라이팅 / 정서적 학대 / 고립 / 통제
  if (/가스라이팅|자존감|내탓|통제|감시|휴대폰|친구|단절|눈치|세뇌/.test(text)) {
    return "⚠️ [정서적 학대 및 통제 징후] 모든 원인을 본인 탓으로 돌리거나 대인관계를 통제하는 것은 전형적인 정서적 폭력(가스라이팅)입니다. 당신의 탓이 결코 아니며 존중받아야 할 소중한 사람입니다. 신뢰할 수 있는 지인이나 전문 심리 상담(마음건강 1393)에 상황을 공유하고 안전한 정서적 분리를 시작하세요.";
  }

  // 4. 금전 갈취 / 협박 / 불법 촬영 / 유포 협박
  if (/돈|빌려|빚|협박|사진|영상|유포|유출|폭로/.test(text)) {
    return "🚨 [디지털 성범죄 및 금전 피해 경고] 사진·영상 유포 협박이나 금전 갈취는 중범죄에 해당합니다. 상대방의 요구에 응하지 마시고, 대화 캡처본을 확보한 후 즉시 '디지털성범죄피해자지원센터(02-735-8994)' 및 경찰청 사이버수사대에 고소장을 접수하세요.";
  }

  // General SOS Safety Default
  return "🚨 [긴급 안전 조치 권고] 연인 관계라 하더라도 상대방의 위협, 폭언, 과도한 집착은 결코 정당화될 수 없는 위해 행위입니다. 혼자 감당하려 하지 마시고 24시간 여성긴급전화 1366(전국 무료) 또는 경찰 112에 상담 이력을 남겨 안전 조치를 취하세요.";
}

// ========================================================
// 3. DATA STORE & INITIAL FALLBACK STORIES
// ========================================================
const defaultFallbackStories = [
  {
    id: 101,
    category: "spicy",
    isSecret: false,
    pin: "1234",
    author: "익명의 사연자 #8821",
    time: "10분 전",
    title: "3년 사귄 전남친의 기상천외한 환승연애 (하소연)",
    content: "헤어지자마자 일주일 만에 제 절친이랑 럽스타그램 시작하더니, 저한테는 \"너랑은 격이 안 맞았다\"고 카톡 차단 엔딩... 이거 제가 미련 남을 일인가요? 진짜 혈압 올라서 잠이 안 와요.",
    prescription: "",
    reactions: { flame: 142, tear: 28, soda: 310 },
    userReacted: null,
    comments: [
      { id: 1, author: "사이다 마니아", time: "8분 전", text: "절친이랑 전남친 둘 다 인생에서 한 번에 걸러진 거면 완전 대박 이득입니다!" },
      { id: 2, author: "환승역 보안관", time: "5분 전", text: "쓰레기끼리 잘 만났다고 축하 화환이나 보내주세요ㅋㅋ" }
    ]
  },
  {
    id: 102,
    category: "spicy",
    isSecret: false,
    pin: "1234",
    author: "익명의 사연자 #4102",
    time: "1시간 전",
    title: "새벽 3시마다 \"자니...?\" 보내고 아침엔 삭제하는 전여친",
    content: "헤어진 지 벌써 6개월인데 술만 마시면 새벽에 전화 걸어서 \"우리 그때 참 좋았잖아\" 하더니 다음 날 낮엔 \"미안 취해서 실수했어\" 카톡 오고 삭제합니다. 이거 어장관리인가요?",
    prescription: "",
    reactions: { flame: 95, tear: 14, soda: 188 },
    userReacted: null,
    comments: [
      { id: 3, author: "통쾌한 사람", time: "40분 전", text: "그냥 외로울 때마다 찔러보는 거 100%입니다. 제발 차단 버튼 누르세요!" }
    ]
  },
  {
    id: 103,
    category: "sos",
    isSecret: false,
    pin: "1234",
    author: "보호 대상자 #1042",
    time: "20분 전",
    title: "이별 통보 후 집 앞을 서성이고 문을 두드리는 전남친, 무섭습니다",
    content: "좋게 헤어지자고 분명히 의사를 밝혔는데, 밤마다 집 도어락 비밀번호를 누르려 하고 현관문 앞에서 서성입니다. 혼자 자취 중이라 너무 무섭고 공포스럽습니다. 어떻게 해야 안전하게 벗어날 수 있을까요?",
    prescription: "🚨 [긴급 신변 보호 조치] 상대방의 반복된 방문이나 주거지 서성임은 명백한 스토킹 범죄(3년 이하 징역 또는 3천만원 이하 벌금)입니다. 절대 문을 열어주거나 단둘이 대면하지 마시고, 즉시 112에 신고하여 '100m 이내 접근금지 및 통신제한 긴급응급조치'를 신청하세요. 여성긴급전화 1366을 통해 임시 안심 숙소 연계 및 CCTV 지원을 받으실 수 있습니다.",
    reactions: { flame: 88, tear: 240, soda: 312 },
    userReacted: null,
    comments: [
      { id: 4, author: "안전 지킴이", time: "15분 전", text: "절대 문 열어주지 마시고 바로 112에 신고하세요! 스마트 초인종 지원도 알아보세요." }
    ]
  }
];

let stories = [...defaultFallbackStories];
let currentCategoryTab = "spicy"; // Active board tab
let selectedWriteCategory = "spicy"; // Active write category
let currentSort = "latest";
let unlockedStoryIds = new Set();
let pendingUnlockStoryId = null;
let activeDetailStoryId = null;

// ========================================================
// 4. SUPABASE DATA FETCH (READ & ACCUMULATE)
// ========================================================
async function fetchStories() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('stories')
        .select('*');

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
      } else if (data && Array.isArray(data) && data.length > 0) {
        const dbStories = data.map((row, idx) => mapDbStory(row, idx + 1));
        stories = dbStories.reverse();
        console.log(`✅ Loaded ${stories.length} stories from Supabase DB.`);
      }
    } catch (err) {
      console.warn('Supabase query exception:', err);
    }
  }

  renderStories();
}

function mapDbStory(row, fallbackId) {
  let parsedReactions = { flame: 0, tear: 0, soda: 0 };
  if (row.reactions) {
    if (typeof row.reactions === 'object') {
      parsedReactions = {
        flame: Number(row.reactions.flame) || 0,
        tear: Number(row.reactions.tear) || 0,
        soda: Number(row.reactions.soda) || 0
      };
    } else if (typeof row.reactions === 'string') {
      try {
        parsedReactions = JSON.parse(row.reactions);
      } catch (e) {}
    }
  } else if (row.likes !== undefined) {
    parsedReactions.flame = Number(row.likes) || 0;
  }

  let parsedComments = [];
  if (row.comments) {
    if (Array.isArray(row.comments)) {
      parsedComments = row.comments;
    } else if (typeof row.comments === 'string') {
      try {
        parsedComments = JSON.parse(row.comments);
      } catch (e) {}
    }
  }

  const uniqueId = row.id !== undefined && row.id !== null ? row.id : fallbackId;
  const rawCat = String(row.category || '').toLowerCase().trim();
  const isSos = rawCat === 'sos' || rawCat.includes('sos') || rawCat.includes('안전');
  const category = isSos ? 'sos' : 'spicy';

  return {
    id: uniqueId,
    dbId: row.id,
    category: category,
    isSecret: Boolean(row.is_secret || row.isSecret),
    pin: String(row.password || row.pin || '1234'),
    author: row.author || (category === 'sos' ? '보호 대상자' : '익명 사연자'),
    time: formatRelativeTime(row.created_at),
    title: row.title || '사연 제목',
    content: row.content || '',
    prescription: category === 'sos' ? (row.prescription || generateSafetyActionGuide(row.content)) : '',
    reactions: parsedReactions,
    userReacted: null,
    comments: parsedComments
  };
}

function formatRelativeTime(dateString) {
  if (!dateString) return '방금 전';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '방금 전';

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return '방금 전';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
}

// ========================================================
// 5. BOOTSTRAP & DOM INITIALIZATION
// ========================================================
function bootstrap() {
  initIntroModal();
  initSidebarDrawer();
  initCategorySync();
  initStoryForm();
  initModals();
  initSearchAndFilter();
  fetchStories();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

// 0) Intro Service Purpose Modal (Auto Popup on Visit)
function initIntroModal() {
  const introModal = document.getElementById("introModal");
  const btnCloseIntro = document.getElementById("btnCloseIntroModal");
  const btnEnterService = document.getElementById("btnEnterService");
  const chkHideIntroToday = document.getElementById("chkHideIntroToday");
  const btnReopenIntro = document.getElementById("btnReopenIntro");

  const todayStr = new Date().toDateString();
  const savedHideDate = localStorage.getItem("hwanjang_hide_intro_until");

  if (introModal && savedHideDate !== todayStr) {
    setTimeout(() => {
      introModal.classList.add("active");
    }, 200);
  }

  const closeIntro = () => {
    if (chkHideIntroToday && chkHideIntroToday.checked) {
      localStorage.setItem("hwanjang_hide_intro_until", todayStr);
    }
    if (introModal) introModal.classList.remove("active");
  };

  if (btnEnterService) btnEnterService.onclick = closeIntro;
  if (btnCloseIntro) btnCloseIntro.onclick = closeIntro;

  if (btnReopenIntro) {
    btnReopenIntro.onclick = () => {
      const sidebarDrawer = document.getElementById("sidebarDrawer");
      const sidebarBackdrop = document.getElementById("sidebarBackdrop");
      if (sidebarDrawer) sidebarDrawer.classList.remove("active");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
      if (introModal) introModal.classList.add("active");
    };
  }
}

// 1) Sidebar Drawer Toggle
function initSidebarDrawer() {
  const btnOpenSidebar = document.getElementById("btnOpenSidebar");
  const btnCloseSidebar = document.getElementById("btnCloseSidebar");
  const sidebarDrawer = document.getElementById("sidebarDrawer");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  const openDrawer = () => {
    if (sidebarDrawer) sidebarDrawer.classList.add("active");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
  };

  const closeDrawer = () => {
    if (sidebarDrawer) sidebarDrawer.classList.remove("active");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
  };

  if (btnOpenSidebar) btnOpenSidebar.onclick = openDrawer;
  if (btnCloseSidebar) btnCloseSidebar.onclick = closeDrawer;
  if (sidebarBackdrop) sidebarBackdrop.onclick = closeDrawer;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebarDrawer && sidebarDrawer.classList.contains("active")) {
      closeDrawer();
    }
  });
}

// 2) TWO-WAY CATEGORY SYNCHRONIZATION (Write Form & Board Tabs)
function initCategorySync() {
  const tabSpicy = document.getElementById("tabSpicy");
  const tabSos = document.getElementById("tabSos");
  const btnWriteSpicy = document.getElementById("btnWriteSpicy");
  const btnWriteSos = document.getElementById("btnWriteSos");

  // Function to update all UI elements to a specific category
  window.setCategory = function(targetCat) {
    currentCategoryTab = targetCat;
    selectedWriteCategory = targetCat;

    // 1. Board Tabs state
    if (targetCat === "spicy") {
      if (tabSpicy) tabSpicy.classList.add("active");
      if (tabSos) tabSos.classList.remove("active");
    } else {
      if (tabSos) tabSos.classList.add("active");
      if (tabSpicy) tabSpicy.classList.remove("active");
    }

    // 2. Write Form Buttons state
    if (btnWriteSpicy && btnWriteSos) {
      if (targetCat === "spicy") {
        btnWriteSpicy.classList.add("active");
        btnWriteSos.classList.remove("active");
      } else {
        btnWriteSos.classList.add("active");
        btnWriteSpicy.classList.remove("active");
      }
    }

    // 3. Update Submit Button & Placeholder Text
    const submitBtnIcon = document.getElementById("submitBtnIcon");
    const submitBtnText = document.getElementById("submitBtnText");
    const storyInput = document.getElementById("storyInput");

    if (targetCat === "spicy") {
      if (submitBtnIcon) submitBtnIcon.textContent = "💌";
      if (submitBtnText) submitBtnText.textContent = "[매운맛 썰] 털어놓기";
      if (storyInput && !storyInput.value) {
        storyInput.placeholder = "전 연인(X)과의 환장할 에피소드나 말 못할 연애 고민을 솔직하게 털어놓아 보세요. (예: 3년 만난 전남친이 잠수이별 후 SNS로 환승연애를 자랑하는데 어떡하죠?)";
      }
    } else {
      if (submitBtnIcon) submitBtnIcon.textContent = "🚨";
      if (submitBtnText) submitBtnText.textContent = "[SOS 안전 상담소]에 사연 접수하기";
      if (storyInput && !storyInput.value) {
        storyInput.placeholder = "가스라이팅, 스토킹, 데이트 폭력, 협박 등 말 못할 위협과 고통을 털어놓으세요. 긴급 안전 조치 가이드를 제공합니다.";
      }
    }

    renderStories();
  };

  // Click on Board Tabs
  if (tabSpicy) tabSpicy.onclick = () => window.setCategory("spicy");
  if (tabSos) tabSos.onclick = () => window.setCategory("sos");

  // Click on Write Form Category Buttons
  if (btnWriteSpicy) btnWriteSpicy.onclick = () => window.setCategory("spicy");
  if (btnWriteSos) btnWriteSos.onclick = () => window.setCategory("sos");
}

// 3) Story Form Submission (INSERT SUPABASE & ACCUMULATE)
function initStoryForm() {
  const storyInput = document.getElementById("storyInput");
  const charCounter = document.getElementById("charCounter");
  const btnSubmitStory = document.getElementById("btnSubmitStory");
  const secretToggle = document.getElementById("secretToggle");
  const pinInput = document.getElementById("pinInput");

  if (storyInput && charCounter) {
    storyInput.addEventListener("input", () => {
      charCounter.textContent = `${storyInput.value.length} / 2000자`;
    });
  }

  if (btnSubmitStory) {
    btnSubmitStory.onclick = async () => {
      const text = storyInput ? storyInput.value.trim() : "";
      if (!text) {
        alert("사연 내용을 입력해주세요!");
        if (storyInput) storyInput.focus();
        return;
      }

      const isSecret = secretToggle ? secretToggle.checked : false;
      const pin = pinInput ? pinInput.value.trim() : "";

      if (isSecret && (!pin || pin.length < 4)) {
        alert("🔒 비밀글 설정 시 4자리 비밀번호를 반드시 입력해야 합니다!");
        if (pinInput) pinInput.focus();
        return;
      }

      // Explicitly use selectedWriteCategory ('spicy' vs 'sos')
      const targetCategory = selectedWriteCategory || currentCategoryTab || "spicy";
      const isSos = targetCategory === "sos";

      // Generate Safety Action Guide only for SOS category
      const safetyGuide = isSos ? generateSafetyActionGuide(text) : "";

      const generatedTitle = isSecret
        ? '🔒 비밀글로 등록된 사연입니다.'
        : text.slice(0, 20) + (text.length > 20 ? '...' : '');

      const authorName = isSecret
        ? `비밀 사연자 #${Math.floor(1000 + Math.random() * 9000)}`
        : (isSos ? `보호 대상자 #${Math.floor(1000 + Math.random() * 9000)}` : `익명 사연자 #${Math.floor(1000 + Math.random() * 9000)}`);

      const newStoryRecord = {
        title: generatedTitle,
        content: text,
        password: pin || '1234',
        category: targetCategory,
        is_secret: isSecret,
        author: authorName,
        prescription: safetyGuide,
        reactions: { flame: 1, tear: 0, soda: 1 },
        comments: []
      };

      btnSubmitStory.disabled = true;
      btnSubmitStory.style.opacity = '0.7';

      try {
        let savedToDb = false;

        if (supabaseClient) {
          const { data, error } = await supabaseClient
            .from('stories')
            .insert([newStoryRecord]);

          if (error) {
            console.warn('Supabase Insert Error:', error.message);
          } else {
            console.log('✅ Supabase Insert Success in category:', targetCategory);
            savedToDb = true;
          }
        }

        if (savedToDb) {
          await fetchStories();
        } else {
          const localStory = {
            id: Date.now(),
            ...mapDbStory({ ...newStoryRecord, created_at: new Date().toISOString() }, Date.now())
          };
          stories.unshift(localStory);
          renderStories();
        }

        // Reset Form
        if (storyInput) storyInput.value = "";
        if (charCounter) charCounter.textContent = "0 / 2000자";
        if (secretToggle) secretToggle.checked = false;
        if (pinInput) pinInput.value = "";

        // Switch to the category of the submitted story to immediately view it
        if (typeof window.setCategory === "function") {
          window.setCategory(targetCategory);
        }

        if (isSos) {
          alert("🚨 [SOS 안전 상담소]에 사연이 등록되었습니다. 긴급 안전 조치 가이드와 상담 기관(1366)을 참고하여 안전을 최우선으로 지켜주세요.");
        } else {
          alert("✨ [매운맛 썰]에 사연이 안전하게 등록되었습니다. 다른 사람들과 따뜻한 공감을 나누어보세요!");
        }
      } catch (err) {
        console.error('Submission Exception:', err);
      } finally {
        btnSubmitStory.disabled = false;
        btnSubmitStory.style.opacity = '1';
      }
    };
  }
}

// ========================================================
// 6. STORY CARDS RENDERING & COUNTERS UPDATE
// ========================================================
function renderStories() {
  const feed = document.getElementById("storyCardsFeed");
  if (!feed) return;

  const searchEl = document.getElementById("searchStoryInput");
  const searchVal = searchEl ? searchEl.value.toLowerCase() : "";
  
  // Calculate total counts for both categories
  const spicyCount = stories.filter(s => s.category === "spicy").length;
  const sosCount = stories.filter(s => s.category === "sos").length;
  
  // Update Tab Count Badges
  const spicyBadge = document.getElementById("spicyCountBadge");
  const sosBadge = document.getElementById("sosCountBadge");
  if (spicyBadge) spicyBadge.textContent = `${spicyCount}개 사연`;
  if (sosBadge) sosBadge.textContent = `${sosCount}개 사연`;

  // Filter for active tab
  let filtered = stories.filter(s => s.category === currentCategoryTab);

  if (searchVal) {
    filtered = filtered.filter(s => 
      (s.title && s.title.toLowerCase().includes(searchVal)) || 
      (s.content && s.content.toLowerCase().includes(searchVal))
    );
  }

  if (currentSort === "popular") {
    filtered.sort((a, b) => ((b.reactions?.flame || 0) + (b.reactions?.soda || 0) + (b.reactions?.tear || 0)) - ((a.reactions?.flame || 0) + (a.reactions?.soda || 0) + (a.reactions?.tear || 0)));
  } else {
    filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  if (filtered.length === 0) {
    const isSpicyTab = currentCategoryTab === "spicy";
    feed.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: #fff; border-radius: 14px; border: 1px solid var(--border-medium);">
        <p style="font-size: 28px; margin-bottom: 8px;">${isSpicyTab ? '🌶️' : '🛡️'}</p>
        <p style="font-size: 15px; font-weight: 700; color: var(--text-main);">
          ${isSpicyTab ? '등록된 매운맛 썰이 없습니다.' : '등록된 SOS 안전 상담 사연이 없습니다.'}
        </p>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
          ${isSpicyTab ? '첫 번째 사연을 남겨 속 시원한 사이다 위로를 받아보세요!' : '남에게 말 못할 위험이나 고민을 안전하게 털어놓고 도움을 받으세요.'}
        </p>
      </div>
    `;
    return;
  }

  feed.innerHTML = filtered.map(story => {
    const isUnlocked = unlockedStoryIds.has(story.id);
    const themeClass = story.category === "sos" ? "burgundy-theme" : "teal-theme";
    const isSpicy = story.category === "spicy";

    const displayedTitle = story.isSecret && !isUnlocked ? "🔒 비밀글로 보호 중인 사연입니다." : story.title;
    const displayedContent = story.isSecret && !isUnlocked ? "(비밀글로 안전하게 보호된 사연입니다. 클릭하여 4자리 비밀번호 인증 후 열람하세요.)" : story.content;
    const contentClass = story.isSecret && !isUnlocked ? "story-excerpt blurred" : "story-excerpt";

    const reaction1Label = isSpicy ? "🔥 환장해요" : "🚨 긴급신고";
    const reaction2Label = isSpicy ? "💔 눈물나요" : "💔 힘내요";
    const reaction3Label = isSpicy ? "💡 사이다" : "💡 지지해요";

    const commentsCount = Array.isArray(story.comments) ? story.comments.length : 0;
    const flameCount = story.reactions?.flame || 0;
    const tearCount = story.reactions?.tear || 0;
    const sodaCount = story.reactions?.soda || 0;

    return `
      <article class="story-card ${themeClass}" data-id="${story.id}">
        <div class="card-top-meta">
          <div class="badge-row">
            <span class="badge-category ${isSpicy ? "spicy" : "sos"}">
              ${isSpicy ? "🔥 매운맛 썰" : "🚨 SOS 안전상담"}
            </span>
            ${story.isSecret ? '<span class="badge-secret">🔒 비밀글</span>' : ""}
            <span style="font-size: 12px; font-weight: 600; color: var(--text-muted);">${escapeHtml(story.author)}</span>
          </div>
          <span class="card-time">${story.time}</span>
        </div>

        <h4 class="story-title" onclick="window.openStoryDetail(${story.id})">${escapeHtml(displayedTitle)}</h4>
        <p class="${contentClass}" onclick="window.openStoryDetail(${story.id})">${escapeHtml(displayedContent)}</p>

        <!-- SOS Safety Alert Box (Displayed ONLY for SOS category) -->
        ${!isSpicy && story.prescription ? `
          <div class="safety-alert-box">
            <div class="safety-alert-header">
              <span>🚨</span>
              <span>[긴급 안전 조치 가이드]</span>
            </div>
            <div class="safety-alert-text">"${escapeHtml(story.prescription)}"</div>
            <div class="safety-alert-actions">
              <a href="tel:1366" class="btn-safety-call">📞 1366 긴급 상담</a>
              <a href="tel:112" class="btn-safety-police">🚨 112 즉시 신고</a>
            </div>
          </div>
        ` : ''}

        <!-- Footer Actions Bar -->
        <div class="card-footer-bar">
          <div class="empathy-actions">
            <button class="empathy-btn ${story.userReacted === "flame" ? (isSpicy ? "teal-reacted" : "reacted") : ""}" onclick="window.reactStory(${story.id}, 'flame')" title="공감 투표">
              <span>${reaction1Label}</span> <b>${flameCount}</b>
            </button>
            <button class="empathy-btn ${story.userReacted === "tear" ? (isSpicy ? "teal-reacted" : "reacted") : ""}" onclick="window.reactStory(${story.id}, 'tear')" title="위로 투표">
              <span>${reaction2Label}</span> <b>${tearCount}</b>
            </button>
            <button class="empathy-btn ${story.userReacted === "soda" ? (isSpicy ? "teal-reacted" : "reacted") : ""}" onclick="window.reactStory(${story.id}, 'soda')" title="사이다 투표">
              <span>${reaction3Label}</span> <b>${sodaCount}</b>
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 12px; color: var(--text-muted); cursor: pointer;" onclick="window.openStoryDetail(${story.id})">
              💬 <b>${commentsCount}</b>개 댓글
            </span>
            <button class="btn-view-solution" onclick="window.openStoryDetail(${story.id})">
              <span>상세 보기 & 댓글 ➔</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Empathy Reactions
window.reactStory = async function(id, type) {
  const story = stories.find(s => s.id === id);
  if (!story) return;

  if (!story.reactions) story.reactions = { flame: 0, tear: 0, soda: 0 };

  if (story.userReacted === type) {
    story.reactions[type] = Math.max(0, (story.reactions[type] || 0) - 1);
    story.userReacted = null;
  } else {
    if (story.userReacted) {
      story.reactions[story.userReacted] = Math.max(0, (story.reactions[story.userReacted] || 0) - 1);
    }
    story.reactions[type] = (story.reactions[type] || 0) + 1;
    story.userReacted = type;
  }

  renderStories();
  if (activeDetailStoryId === id) {
    renderDetailModalContent(story);
  }

  if (supabaseClient) {
    try {
      if (story.dbId) {
        await supabaseClient.from('stories').update({ reactions: story.reactions }).eq('id', story.dbId);
      } else {
        await supabaseClient.from('stories').update({ reactions: story.reactions }).eq('content', story.content);
      }
    } catch (e) {
      console.warn('Reaction update error:', e);
    }
  }
};

// ========================================================
// 7. STORY DETAIL MODAL (Comments & Robust Edit/Delete)
// ========================================================
window.openStoryDetail = function(id) {
  const story = stories.find(s => s.id === id);
  if (!story) return;

  // Secret Post PIN Verification check
  if (story.isSecret && !unlockedStoryIds.has(story.id)) {
    pendingUnlockStoryId = story.id;
    const unlockInput = document.getElementById("unlockPinInput");
    if (unlockInput) unlockInput.value = "";
    const pinModal = document.getElementById("pinModal");
    if (pinModal) pinModal.classList.add("active");
    if (unlockInput) unlockInput.focus();
    return;
  }

  activeDetailStoryId = story.id;
  renderDetailModalContent(story);
  const detailModal = document.getElementById("storyDetailModal");
  if (detailModal) detailModal.classList.add("active");
};

function renderDetailModalContent(story, isEditMode = false) {
  const contentDiv = document.getElementById("detailModalContent");
  if (!contentDiv) return;

  const isSpicy = story.category === "spicy";
  const comments = Array.isArray(story.comments) ? story.comments : [];

  contentDiv.innerHTML = `
    <!-- Top Category & Author info -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="badge-category ${isSpicy ? "spicy" : "sos"}">
          ${isSpicy ? "🔥 매운맛 썰" : "🚨 SOS 안전상담"}
        </span>
        ${story.isSecret ? '<span class="badge-secret">🔒 비밀글</span>' : ""}
        <span style="font-size: 12.5px; font-weight: 600; color: var(--text-muted);">${story.author} · ${story.time}</span>
      </div>
    </div>

    <!-- Title & Content (View Mode vs Edit Mode) -->
    ${isEditMode ? `
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 700; color: var(--burgundy-800); display: block; margin-bottom: 4px;">사연 제목 수정:</label>
        <input type="text" id="editStoryTitle" value="${escapeHtml(story.title)}" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1.5px solid var(--burgundy-600); font-size: 14px; font-weight: 700; margin-bottom: 10px;" />
        <label style="font-size: 12px; font-weight: 700; color: var(--burgundy-800); display: block; margin-bottom: 4px;">사연 본문 수정:</label>
        <textarea id="editStoryContent" class="edit-story-textarea">${escapeHtml(story.content)}</textarea>
        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
          <button class="btn-mgmt" onclick="renderDetailModalContent(stories.find(s => s.id === ${story.id}), false)">취소</button>
          <button class="btn-primary-burgundy" style="padding: 8px 18px; font-size: 13px;" onclick="window.saveStoryEdit(${story.id})">저장 완료</button>
        </div>
      </div>
    ` : `
      <h3 class="modal-title" style="font-size: 18.5px; line-height: 1.4;">${escapeHtml(story.title)}</h3>
      <div style="background: var(--bg-subtle); padding: 18px; border-radius: 12px; margin: 16px 0; font-size: 14.5px; line-height: 1.7; color: var(--text-main);">
        ${escapeHtml(story.content).replace(/\\n/g, '<br/>')}
      </div>

      <!-- Story Management (Edit / Delete) Buttons -->
      <div class="story-mgmt-bar">
        <span style="font-size: 11.5px; color: var(--text-light); margin-right: auto;">🔑 작성자 관리:</span>
        <button class="btn-mgmt btn-mgmt-edit" onclick="window.promptEditStory(${story.id})" title="사연 수정">
          ✏️ 수정
        </button>
        <button class="btn-mgmt btn-mgmt-delete" onclick="window.promptDeleteStory(${story.id})" title="사연 삭제">
          🗑️ 삭제
        </button>
      </div>
    `}

    <!-- SOS Safety Action Guide (Displayed ONLY for SOS category) -->
    ${!isSpicy && story.prescription ? `
      <div class="safety-alert-box" style="margin: 18px 0;">
        <div class="safety-alert-header">
          <span>🚨</span>
          <span>[긴급 안전 조치 가이드]</span>
        </div>
        <p class="safety-alert-text">"${escapeHtml(story.prescription)}"</p>
        <div class="safety-alert-actions">
          <a href="tel:1366" class="btn-safety-call">📞 1366 긴급 상담 연결</a>
          <a href="tel:112" class="btn-safety-police">🚨 112 경찰 신고</a>
        </div>
      </div>
    ` : ''}

    <!-- COMMENTS SECTION -->
    <section class="comments-section">
      <div class="comments-header">
        <span class="comments-count-title">💬 따뜻한 위로 & 공감 댓글 <span style="color: var(--burgundy-700);">(${comments.length})</span></span>
        <span style="font-size: 11.5px; color: var(--text-muted);">안전하고 클린한 댓글 문화에 동참해주세요.</span>
      </div>

      <!-- Comment Form -->
      <div class="comment-input-form">
        <div class="comment-author-row">
          <span style="font-size: 12px; font-weight: 700; color: var(--text-main);">작성자 닉네임:</span>
          <input type="text" id="commentAuthorInput" class="comment-author-input" placeholder="익명 상담러" value="익명의 위로자 #${Math.floor(100 + Math.random() * 900)}" />
        </div>
        <div class="comment-textarea-wrap">
          <textarea id="commentTextInput" class="comment-textarea" placeholder="사연자에게 따뜻한 위로나 지지, 조언의 한마디를 남겨보세요..."></textarea>
          <button class="btn-submit-comment" onclick="window.submitComment(${story.id})">댓글 등록</button>
        </div>
      </div>

      <!-- Comments List -->
      <div class="comment-list" id="modalCommentList">
        ${comments.length === 0 ? `
          <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">
            아직 작성된 댓글이 없습니다. 첫 번째 위로와 지지의 한마디를 남겨보세요!
          </div>
        ` : comments.map(c => `
          <div class="comment-item">
            <div class="comment-item-top">
              <div class="comment-user-info">
                <div class="comment-user-avatar">${escapeHtml(c.author ? c.author.slice(0, 1) : '익')}</div>
                <span class="comment-username">${escapeHtml(c.author || '익명')}</span>
              </div>
              <span class="comment-time">${escapeHtml(c.time || '방금 전')}</span>
            </div>
            <p class="comment-text">${escapeHtml(c.text || '')}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

// Comments Submission
window.submitComment = async function(storyId) {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const authorInput = document.getElementById("commentAuthorInput");
  const textInput = document.getElementById("commentTextInput");
  const text = textInput ? textInput.value.trim() : "";
  const author = authorInput ? authorInput.value.trim() || "익명의 위로자" : "익명의 위로자";

  if (!text) {
    alert("댓글 내용을 입력해주세요!");
    if (textInput) textInput.focus();
    return;
  }

  if (!Array.isArray(story.comments)) story.comments = [];

  const newComment = {
    id: Date.now(),
    author: author,
    time: "방금 전",
    text: text
  };

  story.comments.unshift(newComment);
  renderDetailModalContent(story);
  renderStories();

  const commentList = document.getElementById("modalCommentList");
  if (commentList) commentList.scrollTop = 0;

  if (supabaseClient) {
    try {
      if (story.dbId) {
        await supabaseClient.from('stories').update({ comments: story.comments }).eq('id', story.dbId);
      } else {
        await supabaseClient.from('stories').update({ comments: story.comments }).eq('content', story.content);
      }
    } catch (e) {
      console.warn('Comment sync warning:', e);
    }
  }
};

// Story Edit & Delete
window.promptEditStory = function(storyId) {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const enteredPin = prompt("🔑 글 작성 시 설정한 4자리 비밀번호를 입력해주세요:");
  if (!enteredPin) return;

  if (enteredPin === story.pin || enteredPin === "1234") {
    renderDetailModalContent(story, true);
  } else {
    alert("❌ 비밀번호가 일치하지 않습니다. (테스트 기본 번호: 1234)");
  }
};

window.saveStoryEdit = async function(storyId) {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const titleEl = document.getElementById("editStoryTitle");
  const contentEl = document.getElementById("editStoryContent");
  const newTitle = titleEl ? titleEl.value.trim() : "";
  const newContent = contentEl ? contentEl.value.trim() : "";

  if (!newTitle || !newContent) {
    alert("제목과 본문을 모두 입력해주세요!");
    return;
  }

  const oldContent = story.content;
  story.title = newTitle;
  story.content = newContent;
  story.time = "수정됨 · 방금 전";

  renderDetailModalContent(story, false);
  renderStories();

  if (supabaseClient) {
    try {
      if (story.dbId) {
        await supabaseClient.from('stories').update({ title: newTitle, content: newContent }).eq('id', story.dbId);
      } else {
        await supabaseClient.from('stories').update({ title: newTitle, content: newContent }).eq('content', oldContent);
      }
      await fetchStories();
    } catch (e) {
      console.warn('Edit sync error:', e);
    }
  }

  alert("✅ 사연이 성공적으로 수정되었습니다!");
};

window.promptDeleteStory = async function(storyId) {
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const enteredPin = prompt("🔑 글 작성 시 설정한 4자리 비밀번호를 입력해주세요:");
  if (!enteredPin) return;

  if (enteredPin === story.pin || enteredPin === "1234") {
    if (confirm("정말로 이 사연을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.")) {
      const contentToDelete = story.content;
      const dbIdToDelete = story.dbId;

      stories = stories.filter(s => s.id !== storyId);
      const detailModal = document.getElementById("storyDetailModal");
      if (detailModal) detailModal.classList.remove("active");
      activeDetailStoryId = null;
      renderStories();

      if (supabaseClient) {
        try {
          if (dbIdToDelete) {
            await supabaseClient.from('stories').delete().eq('id', dbIdToDelete);
          } else {
            await supabaseClient.from('stories').delete().eq('content', contentToDelete);
          }
          await fetchStories();
        } catch (e) {
          console.warn('Delete sync error:', e);
        }
      }

      alert("🗑️ 사연이 안전하게 삭제되었습니다.");
    }
  } else {
    alert("❌ 비밀번호가 일치하지 않습니다. (테스트 기본 번호: 1234)");
  }
};

// ========================================================
// 8. MODALS & POPUPS EVENT HANDLERS
// ========================================================
function initModals() {
  // Emergency Modal (1366 Hotline)
  const emergencyModal = document.getElementById("emergencyModal");
  const btnOpenEmergency = document.getElementById("btnOpenEmergencyModal");
  const btnCloseEmergency = document.getElementById("btnCloseEmergencyModal");
  const btnQuickExit = document.getElementById("btnQuickExit");

  if (btnOpenEmergency && emergencyModal) {
    btnOpenEmergency.onclick = () => emergencyModal.classList.add("active");
  }
  if (btnCloseEmergency && emergencyModal) {
    btnCloseEmergency.onclick = () => emergencyModal.classList.remove("active");
  }

  if (btnQuickExit) {
    btnQuickExit.onclick = () => {
      window.location.replace("https://www.naver.com");
    };
  }

  // Secret PIN Unlock Modal
  const pinModal = document.getElementById("pinModal");
  const btnClosePin = document.getElementById("btnClosePinModal");
  const btnConfirmPin = document.getElementById("btnConfirmPin");
  const unlockPinInput = document.getElementById("unlockPinInput");

  if (btnClosePin && pinModal) {
    btnClosePin.onclick = () => pinModal.classList.remove("active");
  }

  if (btnConfirmPin) {
    btnConfirmPin.onclick = () => {
      const inputVal = unlockPinInput ? unlockPinInput.value.trim() : "";
      const story = stories.find(s => s.id === pendingUnlockStoryId);

      if (story && (inputVal === story.pin || inputVal === "1234")) {
        unlockedStoryIds.add(story.id);
        if (pinModal) pinModal.classList.remove("active");
        renderStories();
        window.openStoryDetail(story.id);
      } else {
        alert("❌ 비밀번호가 일치하지 않습니다. (테스트 기본 번호: 1234)");
        if (unlockPinInput) unlockPinInput.focus();
      }
    };
  }

  if (unlockPinInput && btnConfirmPin) {
    unlockPinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") btnConfirmPin.click();
    });
  }

  // Story Detail Modal Close
  const storyDetailModal = document.getElementById("storyDetailModal");
  const btnCloseDetail = document.getElementById("btnCloseDetailModal");
  if (btnCloseDetail && storyDetailModal) {
    btnCloseDetail.onclick = () => {
      storyDetailModal.classList.remove("active");
      activeDetailStoryId = null;
    };
  }

  // Crown Floating Button Menu
  const crownModal = document.getElementById("crownMenuModal");
  const btnFloatingCrown = document.getElementById("btnFloatingCrown");
  const btnCloseCrown = document.getElementById("btnCloseCrownModal");
  const btnQuickWrite = document.getElementById("btnQuickWrite");
  const btnQuickEmergency = document.getElementById("btnQuickEmergency");

  if (btnFloatingCrown && crownModal) {
    btnFloatingCrown.onclick = () => crownModal.classList.add("active");
  }
  if (btnCloseCrown && crownModal) {
    btnCloseCrown.onclick = () => crownModal.classList.remove("active");
  }

  if (btnQuickWrite) {
    btnQuickWrite.onclick = () => {
      if (crownModal) crownModal.classList.remove("active");
      const storyInput = document.getElementById("storyInput");
      if (storyInput) storyInput.focus();
      window.scrollTo({ top: 300, behavior: "smooth" });
    };
  }

  if (btnQuickEmergency) {
    btnQuickEmergency.onclick = () => {
      if (crownModal) crownModal.classList.remove("active");
      if (emergencyModal) emergencyModal.classList.add("active");
    };
  }

  // Backdrop click to close modals
  window.addEventListener("click", (e) => {
    const introModal = document.getElementById("introModal");
    if (introModal && e.target === introModal) introModal.classList.remove("active");
    if (emergencyModal && e.target === emergencyModal) emergencyModal.classList.remove("active");
    if (pinModal && e.target === pinModal) pinModal.classList.remove("active");
    if (storyDetailModal && e.target === storyDetailModal) {
      storyDetailModal.classList.remove("active");
      activeDetailStoryId = null;
    }
    if (crownModal && e.target === crownModal) crownModal.classList.remove("active");
  });

  // ESC key to close all modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const introModal = document.getElementById("introModal");
      if (introModal) introModal.classList.remove("active");
      if (emergencyModal) emergencyModal.classList.remove("active");
      if (pinModal) pinModal.classList.remove("active");
      if (storyDetailModal) storyDetailModal.classList.remove("active");
      if (crownModal) crownModal.classList.remove("active");
      activeDetailStoryId = null;
    }
  });
}

// Search and Filter toolbar
function initSearchAndFilter() {
  const searchInput = document.getElementById("searchStoryInput");
  const sortChips = document.querySelectorAll(".sort-chips .chip-btn");

  if (searchInput) {
    searchInput.addEventListener("input", () => renderStories());
  }

  sortChips.forEach(chip => {
    chip.addEventListener("click", () => {
      sortChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      currentSort = chip.getAttribute("data-sort") || "latest";
      renderStories();
    });
  });
}

// Utility to escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
