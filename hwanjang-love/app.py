# -*- coding: utf-8 -*-
"""
환장연애 (EXChange) — 현실 연애 솔루션 & 안전 상담소
Streamlit 버전 애플리케이션
"""
import streamlit as st
import random
import time
from datetime import datetime

st.set_page_config(
    page_title="환장연애 (EXChange) — 현실 연애 솔루션 & 안전 상담소",
    page_icon="👑",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Burgundy / Dusty Teal Theme
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Pretendard:wght@300;400;500;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Pretendard', sans-serif;
}

/* Custom Header Titles */
h1, h2, h3, .serif-font {
    font-family: 'Gowun Batang', serif !important;
}

/* Color Variables */
:root {
    --burgundy: #991c22;
    --burgundy-dark: #6e1116;
    --burgundy-light: #faebec;
    --teal: #47666f;
    --teal-light: #e8f1f3;
    --cream: #faf7f2;
}

/* App Background */
.stApp {
    background-color: var(--cream);
}

/* Center Logo Header */
.logo-header-wrap {
    text-align: center;
    margin-bottom: 24px;
}

/* Subway Metaphor Bar */
.transit-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    background: #ffffff;
    border: 1px solid #d6cdc1;
    border-radius: 9999px;
    padding: 8px 18px;
    margin: 14px auto 20px;
    max-width: 650px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.pill-station {
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.pill-ex {
    background: #e8f1f3;
    color: #324c53;
    border: 1px solid rgba(71,102,111,0.3);
}

.pill-current {
    background: #991c22;
    color: #ffffff;
}

.pill-new {
    background: #faebec;
    color: #7a151b;
    border: 1px solid rgba(153,28,34,0.3);
}

/* Card Styling */
.story-card-box {
    background: #ffffff;
    border: 1px solid #d6cdc1;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.story-card-spicy {
    border-left: 5px solid #47666f;
}

.story-card-sos {
    border-left: 5px solid #991c22;
    background: linear-gradient(to right, rgba(153,28,34,0.02), #ffffff);
}

/* Custom Buttons */
div.stButton > button:first-child {
    background: linear-gradient(135deg, #991c22 0%, #6e1116 100%) !important;
    color: #ffffff !important;
    font-family: 'Gowun Batang', serif !important;
    font-weight: 700 !important;
    font-size: 15px !important;
    border: none !important;
    border-radius: 10px !important;
    padding: 10px 24px !important;
    box-shadow: 0 4px 12px rgba(153,28,34,0.25) !important;
    transition: all 0.2s ease !important;
}

div.stButton > button:first-child:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(153,28,34,0.35) !important;
}

/* Emergency Fixed Widget */
.emergency-fixed-box {
    background: linear-gradient(135deg, #1f2a2d 0%, #2f3e43 100%);
    color: #ffffff;
    padding: 14px 18px;
    border-radius: 12px;
    border-left: 4px solid #d32f2f;
    margin-top: 24px;
}
</style>
""", unsafe_allow_html=True)

# Initialize Session State
if "stories" not in st.session_state:
    st.session_state.stories = [
        {
            "id": 1,
            "category": "spicy",
            "is_secret": False,
            "pin": "1234",
            "author": "익명의 사연자 #8821",
            "time": "10분 전",
            "title": "3년 사귄 전남친의 기상천외한 환승연애 (매운맛 썰)",
            "content": "헤어지자마자 일주일 만에 제 절친이랑 럽스타그램 시작하더니, 저한테는 '너랑은 격이 안 맞았다'고 카톡 차단 엔딩... 이거 제가 미련 남을 일인가요?",
            "counselor": "냉정한 팩폭러",
            "counselor_avatar": "⚡",
            "prescription": "격이 안 맞은 게 아니라 그 인간 인격에 심각한 하자가 있던 겁니다. 쓰레기통에서 제 발로 걸어나가 준 은인에게 감사하고, 팝콘 씹으면서 둘의 파국을 직관하세요.",
            "reactions": {"flame": 142, "tear": 28, "soda": 310}
        },
        {
            "id": 2,
            "category": "spicy",
            "is_secret": False,
            "pin": "1234",
            "author": "익명의 사연자 #4102",
            "time": "1시간 전",
            "title": "새벽 3시마다 '자니...?' 보내고 아침엔 삭제하는 전여친",
            "content": "헤어진 지 벌써 6개월인데 술만 마시면 새벽에 전화 걸어서 '우리 그때 참 좋았잖아' 하더니 다음 날 낮엔 '실수였다'고 삭제합니다. 이거 어장관리인가요?",
            "counselor": "사이다 해결사",
            "counselor_avatar": "🥤",
            "prescription": "감정 쓰레기통 역할을 자처하지 마세요. 다음에 또 새벽에 오면 '응 자는 중인데 차단할게' 8글자 남기고 즉시 수신거부 거는 게 유일한 구원입니다.",
            "reactions": {"flame": 95, "tear": 14, "soda": 188}
        },
        {
            "id": 3,
            "category": "sos",
            "is_secret": False,
            "pin": "1234",
            "author": "보호 대상자 #1042",
            "time": "20분 전",
            "title": "이별 통보 후 집 앞을 서성이고 문을 두드리는 전남친, 무섭습니다",
            "content": "좋게 헤어지자고 분명히 의사를 밝혔는데, 밤마다 집 도어락 비밀번호를 누르려 하고 현관문 앞에서 서성입니다. 혼자 자취 중이라 너무 무섭고 공포스럽습니다.",
            "counselor": "현실적 전략가",
            "counselor_avatar": "🎯",
            "prescription": "🚨 [긴급 안전 처방] 지금 즉시 112에 스토킹 처벌법 위반으로 신고하고 '100m 이내 접근금지 긴급조치'를 신청하세요. 절대 직접 대화로 해결하려 하지 말고 1366의 주거 지원과 상담을 연계받으세요.",
            "reactions": {"flame": 88, "tear": 240, "soda": 312}
        }
    ]

# AI Roast Prescriptions
ai_roast_db = {
    "냉정한 팩폭러": [
        "환승역에서 길 잃었다고 울지 마세요. 그 사람은 그냥 원래 환승 전문 버스였습니다. 하차벨 누르고 새 출발 하세요.",
        "미련은 상대방이 대단해서가 아니라 당신이 준 사랑이 아까워서 생기는 착시입니다. 당장 정신 차리세요."
    ],
    "따뜻한 공감러": [
        "그동안 혼자서 얼마나 마음 졸이고 가슴앓이를 하셨을까요. 당신의 진심은 죄가 없습니다. 이제 당신 자신을 먼저 안아주세요.",
        "상처받은 당신의 마음을 따뜻한 온기로 감싸드리고 싶습니다. 다 지나갈 테니 자책하지 마세요."
    ],
    "현실적 전략가": [
        "감정적 대응은 0점입니다. 1단계: 연락처 차단, 2단계: 선물 일괄 정리, 3단계: 새로운 루틴 형성 순으로 실행하세요.",
        "상대의 심리를 간파하세요. 반응을 보이지 않는 침묵이야말로 상대의 통제욕을 무력화시키는 가장 강력한 무기입니다."
    ],
    "사이다 해결사": [
        "똥차가 가야 벤츠가 온다는 불변의 진리! 미련 없이 훌훌 털어버리고 샴페인 터뜨릴 준비나 하세요!",
        "구질구질한 전남친/전여친 퇴치 완료! 인생의 소중한 시간을 낭비하지 마시고 오늘부터 당신이 주인공입니다!"
    ]
}

# ================= SIDEBAR =================
with st.sidebar:
    st.markdown("""
    <div style="background: #faebec; padding: 6px 12px; border-radius: 9999px; border: 1px solid rgba(153,28,34,0.2); font-size: 11px; font-weight: 700; color: #991c22; width: fit-content; margin-bottom: 8px;">
        EXCHANGE SETTING
    </div>
    <h2 class="serif-font" style="color: #1d1819; margin-top: 0;">서비스 설정 <span style="color: #991c22;">(EXChange)</span></h2>
    <p style="font-size: 12px; color: #73696b;">환장연애 AI 상담 엔진과 상담사 페르소나를 설정합니다.</p>
    <hr style="margin: 14px 0; border: none; border-top: 1px solid #e8e2d8;">
    """, unsafe_allow_html=True)

    st.markdown("<h4 class='serif-font' style='color: #7a151b; margin-bottom: 4px;'>① 1단계: API 키</h4>", unsafe_allow_html=True)
    api_key = st.text_input("API Key", value="AIzaSyDemoKeyExchange2026", type="password", label_visibility="collapsed")
    st.caption("🔒 API 키는 로컬 세션에만 안전하게 보관됩니다.")

    st.markdown("<br><h4 class='serif-font' style='color: #7a151b; margin-bottom: 4px;'>② 2단계: 상담사 선택</h4>", unsafe_allow_html=True)
    counselor_options = {
        "⚡ 냉정한 팩폭러": ("냉정한 팩폭러", "⚡", "현실 직시 · 뼈때림"),
        "☕ 따뜻한 공감러": ("따뜻한 공감러", "☕", "무한 공감 · 감정 케어"),
        "🎯 현실적 전략가": ("현실적 전략가", "🎯", "스텝별 대응 · 전략 솔루션"),
        "🥤 사이다 해결사": ("사이다 해결사", "🥤", "통쾌한 한방 · 미련 청산")
    }
    selected_counselor_label = st.radio("상담사", list(counselor_options.keys()), index=0, label_visibility="collapsed")
    counselor_name, counselor_avatar, counselor_tag = counselor_options[selected_counselor_label]

    st.markdown("<br><h4 class='serif-font' style='color: #7a151b; margin-bottom: 4px;'>③ 3단계: 모델 선택</h4>", unsafe_allow_html=True)
    model_choice = st.selectbox("AI Model", ["Gemini 1.5 Pro (고도화 심층 분석)", "GPT-4o (초고속 실시간 솔루션)", "Claude 3.5 Sonnet (감성 공감 특화)"], label_visibility="collapsed")
    st.caption("✨ 질문 맥락과 감정선을 가장 깊게 해석합니다.")

    # Fixed Emergency Helpline Guide in Sidebar Bottom
    st.markdown("""
    <div class="emergency-fixed-box">
        <div style="font-size: 11px; color: #ff8a80; font-weight: 700; text-transform: uppercase;">24시간 긴급 안심 핫라인</div>
        <div style="font-size: 15px; font-weight: 700; margin: 4px 0;">📞 여성긴급전화 1366</div>
        <div style="font-size: 14px; font-weight: 700;">📞 마음건강상담 1393</div>
        <div style="font-size: 11px; color: #cfd8dc; margin-top: 6px;">신변 위협 및 데이트폭력 시 주저 없이 상담받으세요.</div>
    </div>
    """, unsafe_allow_html=True)

# ================= MAIN AREA =================

# Logo Banner & Stepper
col1, col2, col3 = st.columns([1, 4, 1])
with col2:
    st.image("assets/hwanjang_logo.png", use_container_width=True)
    st.markdown("""
    <div class="transit-bar">
        <div class="pill-station pill-ex">① eX 과거 사연 공유</div>
        <span style="color: #9c9193;">➔</span>
        <div class="pill-station pill-current">② 환장연애 맞춤 상담소</div>
        <span style="color: #9c9193;">➔</span>
        <div class="pill-station pill-new">③ New 새로운 시작과 처방전</div>
    </div>
    <p style="text-align: center; font-family: 'Gowun Batang', serif; font-size: 15px; color: #6b6263;">
        환승보다 아찔한 현실 연애 고민, AI 상담사가 명쾌하게 진단해드립니다.
    </p>
    """, unsafe_allow_html=True)

# Section 1: Story Submission
with st.container():
    st.markdown(f"""
    <div style="background: #ffffff; border: 1px solid #d6cdc1; border-top: 4px solid #991c22; border-radius: 14px; padding: 22px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 class="serif-font" style="margin: 0; color: #1d1819;">연애 사연 접수하기</h3>
            <span style="background: #faebec; color: #991c22; font-weight: 700; font-size: 12px; padding: 4px 10px; border-radius: 9999px;">
                {counselor_avatar} [{counselor_name}] 배정 완료
            </span>
        </div>
    """, unsafe_allow_html=True)

    story_text = st.text_area(
        "사연 작성",
        placeholder="전 연인(X)과의 환장할 에피소드나 말 못할 연애 고민을 솔직하게 털어놓아 보세요. (예: 3년 만난 전남친이 잠수이별 후 SNS로 환승연애를 자랑하는데 어떡하죠?)",
        height=130,
        label_visibility="collapsed"
    )

    # Protection Controls: Category, Secret Toggle, 4-digit PIN
    prot_col1, prot_col2, prot_col3 = st.columns([1.5, 1.2, 1.3])
    with prot_col1:
        post_cat = st.selectbox("사연 유형", ["🔥 매운맛 썰 (일반 하소연)", "🚨 SOS 안전 상담 (진지한 도움 요청)"])
    with prot_col2:
        is_secret = st.checkbox("🔒 나만 보기 (비밀글)", value=False)
    with prot_col3:
        post_pin = st.text_input("🔑 비밀번호 (4자리)", placeholder="••••", max_chars=4, type="password")

    btn_col1, btn_col2 = st.columns([2, 1])
    with btn_col1:
        submit_clicked = st.button(f"{counselor_avatar} [{counselor_name}]에게 사연 말하기", use_container_width=True)
    with btn_col2:
        record_clicked = st.button("🎤 클릭하여 사연 녹음하기", use_container_width=True)

    if record_clicked:
        st.info("🎙️ 음성 사연 녹음 시뮬레이션: 마이크 입력을 텍스트로 자동 변환 중입니다...")
        time.sleep(1)
        st.success("🎙️ 음성 변환 완료: '3년 동안 만났던 전남친이 헤어지자마자 제 절친과 환승연애 중인 걸 알게 되었습니다.'")

    if submit_clicked:
        if not story_text.strip():
            st.error("사연 내용을 입력해주세요!")
        elif is_secret and (not post_pin or len(post_pin) < 4):
            st.error("비밀글로 등록 시 4자리 비밀번호를 반드시 입력해주세요!")
        else:
            cat_code = "spicy" if "매운맛" in post_cat else "sos"
            prescriptions = ai_roast_db.get(counselor_name, ai_roast_db["냉정한 팩폭러"])
            chosen_presc = random.choice(prescriptions)

            new_item = {
                "id": len(st.session_state.stories) + 1,
                "category": cat_code,
                "is_secret": is_secret,
                "pin": post_pin if post_pin else "1234",
                "author": f"사연자 #{random.randint(1000, 9999)}",
                "time": "방금 전",
                "title": "🔒 비밀글로 등록된 연애 사연입니다." if is_secret else story_text[:35] + ("..." if len(story_text) > 35 else ""),
                "content": story_text,
                "counselor": counselor_name,
                "counselor_avatar": counselor_avatar,
                "prescription": chosen_presc,
                "reactions": {"flame": 1, "tear": 0, "soda": 1}
            }
            st.session_state.stories.insert(0, new_item)
            st.success(f"✨ [{counselor_name}]에게 사연이 접수되어 처방전이 발행되었습니다!")

    st.markdown("</div>", unsafe_allow_html=True)

# Section 2: Category Tabs (Dusty Teal vs Burgundy Red)
tab_spicy, tab_sos = st.tabs(["🔥 매운맛 썰 (일반 하소연)", "🚨 SOS 안전 상담소 (진지한 고민/도움)"])

with tab_spicy:
    st.markdown("<p style='font-size: 13px; color: #47666f; font-weight: 600;'>답답하고 기막힌 전 연인·환장 에피소드 실시간 썰</p>", unsafe_allow_html=True)
    spicy_stories = [s for s in st.session_state.stories if s["category"] == "spicy"]
    for s in spicy_stories:
        st.markdown(f"""
        <div class="story-card-box story-card-spicy">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="background: #e8f1f3; color: #324c53; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">
                    🔥 매운맛 썰 {'🔒 비밀글' if s['is_secret'] else ''}
                </span>
                <span style="font-size: 11px; color: #9c9193;">{s['author']} · {s['time']}</span>
            </div>
            <h4 class="serif-font" style="margin: 6px 0; color: #1d1819;">{s['title']}</h4>
            <p style="font-size: 14px; color: #3c3436; margin-bottom: 10px;">
                {'(비밀글로 보호된 사연입니다.)' if s['is_secret'] else s['content']}
            </p>
            <div style="background: #f3efe8; padding: 10px 14px; border-radius: 8px; border-left: 3px solid #991c22; font-size: 13px; color: #1d1819;">
                <b>{s['counselor_avatar']} [{s['counselor']}의 처방전]</b>: "{s['prescription']}"
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #73696b;">
                🔥 환장해요 {s['reactions']['flame']} &nbsp;&nbsp; 💔 눈물나요 {s['reactions']['tear']} &nbsp;&nbsp; 💡 사이다 {s['reactions']['soda']}
            </div>
        </div>
        """, unsafe_allow_html=True)

with tab_sos:
    st.markdown("<p style='font-size: 13px; color: #991c22; font-weight: 600;'>가스라이팅, 데이트 폭력, 안전 이별 전문 심리 상담 지원</p>", unsafe_allow_html=True)
    sos_stories = [s for s in st.session_state.stories if s["category"] == "sos"]
    for s in sos_stories:
        st.markdown(f"""
        <div class="story-card-box story-card-sos">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="background: #faebec; color: #7a151b; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">
                    🚨 SOS 안전 상담 {'🔒 비밀글' if s['is_secret'] else ''}
                </span>
                <span style="font-size: 11px; color: #9c9193;">{s['author']} · {s['time']}</span>
            </div>
            <h4 class="serif-font" style="margin: 6px 0; color: #1d1819;">{s['title']}</h4>
            <p style="font-size: 14px; color: #3c3436; margin-bottom: 10px;">
                {'(비밀글로 보호된 사연입니다.)' if s['is_secret'] else s['content']}
            </p>
            <div style="background: #faebec; padding: 10px 14px; border-radius: 8px; border-left: 3px solid #991c22; font-size: 13px; color: #1d1819;">
                <b>{s['counselor_avatar']} [{s['counselor']}의 안심 처방]</b>: "{s['prescription']}"
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #73696b;">
                🚨 긴급대응 {s['reactions']['flame']} &nbsp;&nbsp; 💔 힘내요 {s['reactions']['tear']} &nbsp;&nbsp; 💡 지지해요 {s['reactions']['soda']}
            </div>
        </div>
        """, unsafe_allow_html=True)
