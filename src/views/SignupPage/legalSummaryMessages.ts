import { defineMessages } from "@/shared/i18n/defineMessages";

export interface LegalArticle {
  title: string;
  body: string;
  items?: string[];
}

interface LegalSummaryText {
  terms: LegalArticle[];
  privacy: LegalArticle[];
}

export const legalSummaryMessages = defineMessages<LegalSummaryText>(
  {
    terms: [
      {
        title: "제1조 (목적)",
        body: '본 약관은 SIGNAL(이하 "서비스")이 제공하는 AI 기반 온라인 피해 예방 및 대응 서비스의 이용조건과 절차, 이용자와 서비스 운영자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
      },
      {
        title: "제2조 (서비스의 내용)",
        body: "서비스는 다음과 같은 기능을 제공합니다.",
        items: [
          "AI 사진 위험도 분석",
          "얼굴 도용 및 딥페이크 탐지",
          "이미지 보호(워터마크·노이즈 삽입)",
          "익명 상담 챗봇",
          "신고 문서 자동 작성",
          "피해 상황에 맞는 기관 안내 및 연결",
        ],
      },
      {
        title: "제3조 (회원가입)",
        body: "회원은 정확한 정보를 입력하여 회원가입을 진행해야 하며, 허위 정보를 입력할 경우 서비스 이용이 제한될 수 있습니다.",
      },
      {
        title: "제4조 (이용자의 의무)",
        body: "이용자는 다음 행위를 하여서는 안 됩니다.",
        items: [
          "타인의 개인정보 도용",
          "불법 콘텐츠 업로드",
          "서비스의 정상적인 운영을 방해하는 행위",
          "법령 또는 공공질서에 반하는 행위",
        ],
      },
      {
        title: "제5조 (서비스 이용 제한)",
        body: "다음의 경우 서비스 이용이 제한될 수 있습니다.",
        items: [
          "약관을 위반한 경우",
          "타인에게 피해를 주는 목적으로 서비스를 이용한 경우",
          "시스템을 악의적으로 이용한 경우",
        ],
      },
      {
        title: "제6조 (면책사항)",
        body: "서비스의 AI 분석 결과는 참고용으로 제공되며, 최종 판단은 사용자의 책임과 관련 기관의 검토를 통해 이루어질 수 있습니다.",
      },
    ],
    privacy: [
      {
        title: "제1조 (개인정보 수집 목적)",
        body: "SIGNAL은 회원 관리, AI 분석 서비스 제공, 문의 응대 및 서비스 개선을 위해 필요한 최소한의 개인정보를 수집합니다.",
      },
      {
        title: "제2조 (수집하는 개인정보 항목)",
        body: "서비스 이용을 위해 다음 정보를 수집할 수 있습니다.",
        items: [
          "이름, 이메일, 비밀번호",
          "나이(생년월일로 계산), 성별",
          "프로필 이미지(선택)",
          "AI 분석·탐지를 위해 업로드한 사진 및 영상",
          "분석·탐지·상담·신고 등 서비스 이용 기록",
          "접속 기록, 브라우저 및 기기 정보",
        ],
      },
      {
        title: "제3조 (개인정보 이용 목적)",
        body: "수집한 개인정보는 다음의 목적으로만 이용됩니다.",
        items: [
          "회원 식별 및 로그인",
          "AI 분석 서비스 제공",
          "신고 문서 작성 지원",
          "고객 문의 대응",
          "서비스 품질 개선",
        ],
      },
      {
        title: "제4조 (보유 및 이용 기간)",
        body: "회원 정보는 회원 탈퇴 시까지 보관하며, 탈퇴하면 업로드한 사진·영상과 분석·탐지·상담·신고 기록도 함께 삭제합니다. 관계 법령에 따라 보관이 필요한 경우 해당 기간 동안 안전하게 보관하며, 자세한 내용은 개인정보처리방침의 '보유 및 이용 기간'과 '상담 및 분석 데이터 처리' 항목을 따릅니다.",
      },
      {
        title: "제5조 (개인정보 보호)",
        body: "SIGNAL은 개인정보 보호를 위해 접근 권한 관리, 암호화 및 보안 조치를 적용하여 개인정보를 안전하게 관리합니다.",
      },
      {
        title: "제6조 (이용자의 권리)",
        body: "이용자는 언제든지 개인정보 조회, 수정 및 삭제를 요청할 수 있으며 회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다.",
      },
    ],
  },
  {
    en: {
      terms: [
        {
          title: "Article 1 (Purpose)",
          body: 'These Terms set out the conditions and procedures for using the AI-based online harm prevention and response service provided by SIGNAL (the "Service"), and the rights, obligations, and responsibilities of users and the Service operator.',
        },
        {
          title: "Article 2 (Service description)",
          body: "The Service provides the following features.",
          items: [
            "AI photo risk analysis",
            "Face theft and deepfake detection",
            "Image protection (watermark and noise insertion)",
            "Anonymous counseling chatbot",
            "Automatic report document drafting",
            "Guidance and connection to agencies suited to your situation",
          ],
        },
        {
          title: "Article 3 (Sign-up)",
          body: "Members must enter accurate information when signing up. Entering false information may result in restricted use of the Service.",
        },
        {
          title: "Article 4 (User obligations)",
          body: "Users must not do any of the following.",
          items: [
            "Misuse another person's personal information",
            "Upload illegal content",
            "Interfere with the normal operation of the Service",
            "Act against the law or public order",
          ],
        },
        {
          title: "Article 5 (Restrictions on use)",
          body: "Use of the Service may be restricted in the following cases.",
          items: [
            "Violating these Terms",
            "Using the Service to harm others",
            "Maliciously exploiting the system",
          ],
        },
        {
          title: "Article 6 (Disclaimer)",
          body: "AI analysis results are provided for reference only. Final decisions remain the user's responsibility and may require review by the relevant agencies.",
        },
      ],
      privacy: [
        {
          title: "Article 1 (Purpose of collection)",
          body: "SIGNAL collects the minimum personal information needed to manage members, provide AI analysis, respond to inquiries, and improve the Service.",
        },
        {
          title: "Article 2 (Information collected)",
          body: "We may collect the following information to provide the Service.",
          items: [
            "Name, email, password",
            "Age (calculated from your date of birth), gender",
            "Profile image (optional)",
            "Photos and videos uploaded for AI analysis or detection",
            "Service usage records such as analysis, detection, chat, and reports",
            "Access logs, browser and device information",
          ],
        },
        {
          title: "Article 3 (Purposes of use)",
          body: "Collected personal information is used only for the following purposes.",
          items: [
            "Identifying members and signing in",
            "Providing AI analysis",
            "Supporting report document drafting",
            "Responding to customer inquiries",
            "Improving service quality",
          ],
        },
        {
          title: "Article 4 (Retention period)",
          body: "Account information is kept until you delete your account. When you do, your uploaded photos and videos and your analysis, detection, chat, and report records are deleted as well. Where applicable laws require retention, it is stored securely for the required period. See 'Retention and use period' and 'Handling of chat and analysis data' in the Privacy Policy for details.",
        },
        {
          title: "Article 5 (Protection of personal information)",
          body: "SIGNAL keeps personal information secure through access control, encryption, and other security measures.",
        },
        {
          title: "Article 6 (Your rights)",
          body: "You may request to view, correct, or delete your personal information at any time, and you can request deletion by deleting your account.",
        },
      ],
    },
    ja: {
      terms: [
        {
          title: "第1条（目的）",
          body: "本規約は、SIGNAL（以下「本サービス」）が提供するAIを活用したオンライン被害の予防・対応サービスの利用条件および手続き、利用者とサービス運営者の権利・義務および責任事項を定めることを目的とします。",
        },
        {
          title: "第2条（サービスの内容）",
          body: "本サービスは次の機能を提供します。",
          items: [
            "AIによる写真の危険度分析",
            "顔の盗用およびディープフェイクの検出",
            "画像の保護（ウォーターマーク・ノイズの挿入）",
            "匿名相談チャットボット",
            "通報書類の自動作成",
            "被害状況に応じた機関のご案内とおつなぎ",
          ],
        },
        {
          title: "第3条（会員登録）",
          body: "会員は正確な情報を入力して会員登録を行う必要があります。虚偽の情報を入力した場合、本サービスの利用が制限されることがあります。",
        },
        {
          title: "第4条（利用者の義務）",
          body: "利用者は次の行為をしてはなりません。",
          items: [
            "他人の個人情報の不正利用",
            "違法なコンテンツのアップロード",
            "本サービスの正常な運営を妨げる行為",
            "法令または公序良俗に反する行為",
          ],
        },
        {
          title: "第5条（サービスの利用制限）",
          body: "次の場合、本サービスの利用が制限されることがあります。",
          items: [
            "本規約に違反した場合",
            "他人に被害を与える目的で本サービスを利用した場合",
            "システムを悪意をもって利用した場合",
          ],
        },
        {
          title: "第6条（免責事項）",
          body: "本サービスのAI分析結果は参考として提供されるものであり、最終的な判断は利用者の責任において、関係機関の確認を経て行われる場合があります。",
        },
      ],
      privacy: [
        {
          title: "第1条（個人情報の収集目的）",
          body: "SIGNALは、会員管理、AI分析サービスの提供、お問い合わせへの対応およびサービス改善のために必要な最小限の個人情報を収集します。",
        },
        {
          title: "第2条（収集する個人情報の項目）",
          body: "サービスの利用にあたり、次の情報を収集する場合があります。",
          items: [
            "氏名、メールアドレス、パスワード",
            "年齢（生年月日から計算）、性別",
            "プロフィール画像（任意）",
            "AI分析・検出のためにアップロードされた写真および動画",
            "分析・検出・相談・通報などのサービス利用記録",
            "アクセス記録、ブラウザおよび端末の情報",
          ],
        },
        {
          title: "第3条（個人情報の利用目的）",
          body: "収集した個人情報は、次の目的にのみ利用します。",
          items: [
            "会員の識別およびログイン",
            "AI分析サービスの提供",
            "通報書類の作成支援",
            "お客様からのお問い合わせへの対応",
            "サービス品質の改善",
          ],
        },
        {
          title: "第4条（保有および利用期間）",
          body: "会員情報は退会するまで保管し、退会するとアップロードされた写真・動画と分析・検出・相談・通報の記録も一緒に削除します。関係法令により保管が必要な場合は、その期間中安全に保管します。詳しくはプライバシーポリシーの「保有および利用期間」と「相談・分析データの取り扱い」に従います。",
        },
        {
          title: "第5条（個人情報の保護）",
          body: "SIGNALは、アクセス権限の管理、暗号化およびセキュリティ対策により、個人情報を安全に管理します。",
        },
        {
          title: "第6条（利用者の権利）",
          body: "利用者はいつでも個人情報の照会、訂正および削除を求めることができ、退会により個人情報の削除を求めることもできます。",
        },
      ],
    },
    zh: {
      terms: [
        {
          title: "第一条（目的）",
          body: "本条款旨在规定 SIGNAL（以下简称“本服务”）所提供的基于AI的网络伤害预防与应对服务的使用条件和流程，以及用户与服务运营方的权利、义务和责任。",
        },
        {
          title: "第二条（服务内容）",
          body: "本服务提供以下功能。",
          items: [
            "AI照片风险分析",
            "面部盗用与深度伪造检测",
            "图片保护（添加水印与噪点）",
            "匿名咨询聊天机器人",
            "自动生成举报文件",
            "根据受害情况推荐并对接相关机构",
          ],
        },
        {
          title: "第三条（注册会员）",
          body: "会员须填写准确的信息完成注册。如填写虚假信息，可能会被限制使用本服务。",
        },
        {
          title: "第四条（用户义务）",
          body: "用户不得实施以下行为。",
          items: [
            "盗用他人个人信息",
            "上传违法内容",
            "妨碍本服务正常运营的行为",
            "违反法律法规或公共秩序的行为",
          ],
        },
        {
          title: "第五条（服务使用限制）",
          body: "在以下情况下，可能会限制使用本服务。",
          items: ["违反本条款", "以伤害他人为目的使用本服务", "恶意利用系统"],
        },
        {
          title: "第六条（免责声明）",
          body: "本服务的AI分析结果仅供参考，最终判断由用户自行负责，并可能需要经相关机构审核。",
        },
      ],
      privacy: [
        {
          title: "第一条（收集个人信息的目的）",
          body: "SIGNAL 仅收集会员管理、提供AI分析服务、回复咨询及改进服务所需的最少个人信息。",
        },
        {
          title: "第二条（收集的个人信息项目）",
          body: "为使用本服务，可能会收集以下信息。",
          items: [
            "姓名、电子邮箱、密码",
            "年龄（根据出生日期计算）、性别",
            "头像（可选）",
            "为AI分析与检测而上传的照片和视频",
            "分析、检测、咨询、举报等服务使用记录",
            "访问记录、浏览器及设备信息",
          ],
        },
        {
          title: "第三条（个人信息的使用目的）",
          body: "收集的个人信息仅用于以下目的。",
          items: [
            "识别会员及登录",
            "提供AI分析服务",
            "协助撰写举报文件",
            "回复用户咨询",
            "提升服务质量",
          ],
        },
        {
          title: "第四条（保存及使用期限）",
          body: "会员信息保存至注销账号为止，注销后上传的照片和视频以及分析、检测、咨询、举报记录也会一并删除。如相关法律法规要求保存，将在规定期限内安全保存。详情请参阅隐私政策中的“保存及使用期限”和“咨询与分析数据的处理”。",
        },
        {
          title: "第五条（个人信息保护）",
          body: "SIGNAL 通过访问权限管理、加密及其他安全措施，安全地管理个人信息。",
        },
        {
          title: "第六条（用户的权利）",
          body: "用户可随时申请查询、修改及删除个人信息，也可通过注销账号申请删除个人信息。",
        },
      ],
    },
  },
);
