import { defineMessages } from "@/shared/i18n/defineMessages";

type SectionId =
  | "collectedData"
  | "purpose"
  | "retention"
  | "thirdParty"
  | "outsourcing"
  | "rights"
  | "security"
  | "consultationData"
  | "contact";

interface PrivacyText {
  title: string;
  description: string;
  toc: Record<SectionId, string>;
  sections: Record<SectionId, string>;
  collectedIntro: string;
  tableCategory: string;
  tableItems: string;
  collectedRows: { label: string; value: string }[];
  purposeItems: string[];
  retention: string;
  deletedRecords: { title: string; description: string };
  thirdParty: string;
  outsourcing: string;
  rights: string;
  securityItems: string[];
  consultationItems: { heading: string; description: string }[];
  contact: string;
}

export const privacyMessages = defineMessages<PrivacyText>(
  {
    title: "개인정보처리방침",
    description: "SIGNAL은 이용자의 개인정보를 소중하게 보호하고, 처리 과정을 투명하게 안내합니다.",
    toc: {
      collectedData: "1. 처리하는 개인정보",
      purpose: "2. 이용 목적",
      retention: "3. 보유 기간",
      thirdParty: "4. 제3자 제공",
      outsourcing: "5. 처리 업무 위탁",
      rights: "6. 이용자의 권리",
      security: "7. 안전성 확보 조치",
      consultationData: "8. 상담 및 분석 데이터",
      contact: "9. 문의 및 변경 안내",
    },
    sections: {
      collectedData: "1. 처리하는 개인정보",
      purpose: "2. 개인정보 이용 목적",
      retention: "3. 보유 및 이용 기간",
      thirdParty: "4. 개인정보의 제3자 제공",
      outsourcing: "5. 개인정보 처리 업무의 위탁",
      rights: "6. 이용자의 권리와 행사 방법",
      security: "7. 개인정보의 안전성 확보 조치",
      consultationData: "8. 상담 및 분석 데이터 처리",
      contact: "9. 문의 및 방침 변경 안내",
    },
    collectedIntro:
      "서비스는 회원가입, 기록 저장 및 문의 처리를 위해 필요한 범위에서 개인정보를 처리합니다.",
    tableCategory: "구분",
    tableItems: "처리 항목",
    collectedRows: [
      {
        label: "회원 정보",
        value:
          "이름, 이메일, 비밀번호(암호화 저장), 나이(가입 시 입력한 생년월일로 계산하며 생년월일은 저장하지 않음), 성별, 프로필 사진(선택)",
      },
      {
        label: "서비스 이용 정보",
        value:
          "분석·탐지를 위해 업로드한 사진·영상, 분석·탐지 기록, 웹 검색으로 찾은 웹 페이지 주소·제목, 저장에 동의한 상담 내역, 신고 문서 내역",
      },
      { label: "자동 생성 정보", value: "접속 기록, 브라우저 및 기기 정보, 서비스 이용 시간" },
    ],
    purposeItems: [
      "회원 식별 및 계정 관리",
      "AI 이미지 분석과 딥페이크 탐지 결과 제공",
      "동의한 상담 및 신고 문서 내역 저장",
      "오류 확인, 보안 유지 및 서비스 개선",
      "문의 대응과 서비스 관련 안내",
    ],
    retention:
      "개인정보는 이용 목적이 달성되면 지체 없이 삭제하는 것을 원칙으로 합니다. 회원 탈퇴 시 계정 정보와 프로필 사진, 업로드한 사진·영상(보호 처리 이미지, 모니터링 기준 이미지, 신고 증거 파일 포함), 분석·탐지·보호·모니터링·상담·신고 기록, 웹 검색 기록을 삭제하며, 관계 법령에 따라 보존 의무가 있는 정보는 정해진 기간 동안 별도로 보관합니다. 다만 웹 역이미지 검색을 위해 외부 검색 서비스로 전송된 사진은 해당 서비스의 방침에 따라 처리됩니다(8항 참고).",
    deletedRecords: {
      title: "사용자가 삭제한 기록",
      description:
        "삭제한 분석·탐지·보호·모니터링·상담·신고 기록은 기록에 쓰인 사진·영상 파일과 함께 삭제되며, 서비스에서 다시 조회할 수 없습니다. 다만 웹 역이미지 검색을 위해 외부 검색 서비스로 전송된 사진은 해당 서비스의 방침에 따라 처리됩니다.",
    },
    thirdParty:
      "원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 법률에 특별한 규정이 있거나 이용자가 사전에 동의한 경우에만 필요한 범위에서 제공합니다.",
    outsourcing:
      "서버 운영, 데이터 보관 또는 본인 인증 업무를 전문 업체에 위탁할 수 있습니다. 위탁이 확정되면 수탁 업체와 업무 내용을 이 방침에 공개합니다.",
    rights:
      "이용자는 개인정보를 조회하거나 수정할 수 있으며, 저장 기록 삭제와 회원 탈퇴를 요청할 수 있습니다. 내 프로필 또는 서비스 문의 채널에서 처리할 수 있습니다.",
    securityItems: [
      "개인정보 접근 권한 최소화 및 접근 기록 관리",
      "전송 구간과 중요 정보 암호화",
      "보안 취약점 점검 및 비정상 접근 모니터링",
      "개인정보 취급자 교육과 내부 관리 절차 운영",
    ],
    consultationItems: [
      {
        heading: "익명 상담",
        description:
          "상담 내용은 기본적으로 저장하지 않으며, 사용자가 저장에 동의한 경우에만 계정의 대화 내역에 보관합니다.",
      },
      {
        heading: "이미지 및 영상 분석",
        description:
          "업로드한 사진·영상은 분석·탐지 결과와 함께 서버에 저장되며, 기록을 삭제하거나 회원 탈퇴를 하면 함께 삭제됩니다. 다만 웹 역이미지 검색을 위해 외부 검색 서비스로 전송된 사진은 해당 서비스의 방침에 따라 처리됩니다. 기록을 삭제하지 않은 경우의 자동 삭제 기간이 정해지면 이 방침을 개정해 안내합니다.",
      },
      {
        heading: "웹 역이미지 검색",
        description:
          "딥페이크 탐지 결과에서 '동의하고 웹에서 찾아보기'를 누르거나 '동의하고 모니터링 시작'을 누른 경우, 같은 이미지가 실린 웹 페이지를 찾기 위해 사진이 국외의 검색 서비스로 전송됩니다. 탐지 결과의 검색은 SerpApi, LLC(미국, serpapi.com)를 거쳐 Google 검색으로 전송되며, 버튼을 누를 때 한 번, 서비스가 사진을 추측할 수 없는 임시 주소로 최대 5분 동안 열어 SerpApi가 가져가게 하고 검색이 끝나면 주소를 바로 닫습니다. 유포 모니터링은 Google LLC(미국, cloud.google.com)의 Google Cloud Vision으로, 시작할 때와 이후 중지할 때까지 하루 한 번 사진을 암호화된 연결(HTTPS)로 직접 전송합니다. 서비스는 검색으로 찾은 웹 페이지 주소와 제목을 저장하며, 탐지 결과의 검색 기록은 30일이 지나면 삭제합니다. 받는 자가 사진을 보유·이용하는 기간은 각 사의 개인정보처리방침을 따릅니다. 버튼을 누르지 않으면 사진은 전송되지 않으며, 이 경우 웹 검색 결과 없이 탐지 결과만 제공됩니다.",
      },
      {
        heading: "전문 기관 연결",
        description:
          "전화 연결이나 외부 홈페이지 이동 시 해당 기관의 개인정보처리방침이 적용됩니다.",
      },
    ],
    contact:
      "개인정보 관련 문의는 서비스 내 문의 채널을 통해 접수할 수 있습니다. 방침이 변경되는 경우 시행일 전에 서비스 공지사항으로 안내합니다.",
  },
  {
    en: {
      title: "Privacy Policy",
      description:
        "SIGNAL values and protects your personal information and explains clearly how it is processed.",
      toc: {
        collectedData: "1. Information we process",
        purpose: "2. Purposes of use",
        retention: "3. Retention period",
        thirdParty: "4. Disclosure to third parties",
        outsourcing: "5. Outsourced processing",
        rights: "6. Your rights",
        security: "7. Security measures",
        consultationData: "8. Chat and analysis data",
        contact: "9. Contact and changes",
      },
      sections: {
        collectedData: "1. Personal information we process",
        purpose: "2. Purposes of using personal information",
        retention: "3. Retention and use period",
        thirdParty: "4. Disclosure of personal information to third parties",
        outsourcing: "5. Outsourcing of personal information processing",
        rights: "6. Your rights and how to exercise them",
        security: "7. Measures to keep personal information secure",
        consultationData: "8. Handling of chat and analysis data",
        contact: "9. Contact and policy changes",
      },
      collectedIntro:
        "We process personal information only to the extent needed for sign-up, saving your records, and handling inquiries.",
      tableCategory: "Category",
      tableItems: "Information processed",
      collectedRows: [
        {
          label: "Account information",
          value:
            "Name, email, password (stored encrypted), age (calculated from the date of birth you enter at sign-up; the date of birth itself is not stored), gender, profile photo (optional)",
        },
        {
          label: "Service usage information",
          value:
            "Photos and videos uploaded for analysis or detection, analysis and detection history, addresses and titles of web pages found by web search, chat history you agreed to save, report document history",
        },
        {
          label: "Automatically generated information",
          value: "Access logs, browser and device information, service usage time",
        },
      ],
      purposeItems: [
        "Identifying members and managing accounts",
        "Providing AI image analysis and deepfake detection results",
        "Saving chat and report document history you agreed to keep",
        "Checking errors, maintaining security, and improving the service",
        "Responding to inquiries and sending service-related notices",
      ],
      retention:
        "As a rule, we delete personal information without delay once its purpose has been fulfilled. When you delete your account, we delete your account information and profile photo, uploaded photos and videos (including protected images, monitoring reference images, and report evidence files), your analysis, detection, protection, monitoring, chat, and report records, and your web search records. Information that must be preserved under applicable laws is stored separately for the required period. However, photos sent to external search services for reverse image search are handled under those services' policies (see Section 8).",
      deletedRecords: {
        title: "Records you delete",
        description:
          "Analysis, detection, protection, monitoring, chat, and report records you delete are removed together with the photo and video files used in them, and can no longer be viewed in the service. Photos sent to external search services for reverse image search are handled under those services' policies.",
      },
      thirdParty:
        "As a rule, we do not provide your personal information to outside parties. We provide it only to the extent necessary when required by law or when you have given prior consent.",
      outsourcing:
        "We may entrust server operation, data storage, or identity verification to specialized companies. Once outsourcing is confirmed, we will disclose the contractors and their tasks in this policy.",
      rights:
        "You can view or correct your personal information and request deletion of saved records or of your account. You can do this from My Profile or through the service's inquiry channel.",
      securityItems: [
        "Minimizing access to personal information and keeping access logs",
        "Encrypting data in transit and sensitive information",
        "Checking for security vulnerabilities and monitoring abnormal access",
        "Training staff who handle personal information and running internal management procedures",
      ],
      consultationItems: [
        {
          heading: "Anonymous chat",
          description:
            "Chat content is not saved by default. It is kept in your account's chat history only if you agree to save it.",
        },
        {
          heading: "Image and video analysis",
          description:
            "Uploaded photos and videos are stored on our servers together with the analysis or detection results, and are deleted when you delete the records or your account. Photos sent to external search services for reverse image search are handled under those services' policies. Once an automatic deletion period is set for records you keep, we will update this policy.",
        },
        {
          heading: "Reverse image search on the web",
          description:
            "If you press 'Agree and search the web' on a deepfake detection result or 'Agree and start monitoring', your photo is sent to a search service outside Korea to find web pages where the same image appears. Detection-result searches go to Google Search through SerpApi, LLC (United States, serpapi.com) once, when you press the button: the service opens the photo at a temporary, unguessable address for up to 5 minutes so SerpApi can fetch it, and closes the address as soon as the search ends. Spread monitoring sends the photo directly over an encrypted connection (HTTPS) to Google Cloud Vision by Google LLC (United States, cloud.google.com) when you start it and once a day until you stop it. We store the addresses and titles of the web pages found, and delete detection-result search records after 30 days. How long the recipients keep and use the photo follows each company's privacy policy. If you don't press the button, your photo isn't sent, and you'll get the detection result without web search results.",
        },
        {
          heading: "Connecting to agencies",
          description:
            "When you call an agency or visit its website, that agency's own privacy policy applies.",
        },
      ],
      contact:
        "You can send privacy-related inquiries through the service's inquiry channel. If this policy changes, we will announce it in service notices before the effective date.",
    },
    ja: {
      title: "プライバシーポリシー",
      description:
        "SIGNALは利用者の個人情報を大切に保護し、その取り扱いについて分かりやすくご案内します。",
      toc: {
        collectedData: "1. 取り扱う個人情報",
        purpose: "2. 利用目的",
        retention: "3. 保有期間",
        thirdParty: "4. 第三者への提供",
        outsourcing: "5. 業務の委託",
        rights: "6. 利用者の権利",
        security: "7. 安全管理措置",
        consultationData: "8. 相談・分析データ",
        contact: "9. お問い合わせと変更のお知らせ",
      },
      sections: {
        collectedData: "1. 取り扱う個人情報",
        purpose: "2. 個人情報の利用目的",
        retention: "3. 保有および利用期間",
        thirdParty: "4. 個人情報の第三者への提供",
        outsourcing: "5. 個人情報の取り扱い業務の委託",
        rights: "6. 利用者の権利とその行使方法",
        security: "7. 個人情報の安全管理措置",
        consultationData: "8. 相談・分析データの取り扱い",
        contact: "9. お問い合わせとポリシー変更のお知らせ",
      },
      collectedIntro:
        "本サービスは、会員登録、記録の保存、お問い合わせへの対応に必要な範囲で個人情報を取り扱います。",
      tableCategory: "区分",
      tableItems: "取り扱う項目",
      collectedRows: [
        {
          label: "会員情報",
          value:
            "氏名、メールアドレス、パスワード（暗号化して保存）、年齢（登録時に入力した生年月日から計算し、生年月日は保存しません）、性別、プロフィール写真（任意）",
        },
        {
          label: "サービス利用情報",
          value:
            "分析・検出のためにアップロードされた写真・動画、分析・検出の記録、Web検索で見つかったWebページのアドレス・タイトル、保存に同意した相談履歴、通報書類の履歴",
        },
        {
          label: "自動生成情報",
          value: "アクセス記録、ブラウザおよび端末の情報、サービス利用時間",
        },
      ],
      purposeItems: [
        "会員の識別およびアカウント管理",
        "AI画像分析とディープフェイク検出結果の提供",
        "同意を得た相談履歴および通報書類の保存",
        "エラーの確認、セキュリティの維持およびサービスの改善",
        "お問い合わせへの対応とサービスに関するご案内",
      ],
      retention:
        "個人情報は利用目的を達成した後、遅滞なく削除することを原則とします。退会時にはアカウント情報とプロフィール写真、アップロードした写真・動画（保護処理した画像、モニタリングの基準画像、通報の証拠ファイルを含む）、分析・検出・保護・モニタリング・相談・通報の記録、Web検索の記録を削除し、関係法令により保存義務がある情報は定められた期間、別途保管します。ただし、Web逆画像検索のために外部の検索サービスへ送信された写真は、各サービスの方針に従って処理されます（第8項参照）。",
      deletedRecords: {
        title: "利用者が削除した記録",
        description:
          "削除された分析・検出・保護・モニタリング・相談・通報の記録は、記録に使われた写真・動画ファイルとともに削除され、サービス上で再び閲覧できなくなります。ただし、Web逆画像検索のために外部の検索サービスへ送信された写真は、各サービスの方針に従って処理されます。",
      },
      thirdParty:
        "原則として、利用者の個人情報を外部に提供しません。法律に特別な定めがある場合、または利用者の事前の同意がある場合に限り、必要な範囲で提供します。",
      outsourcing:
        "サーバー運用、データ保管または本人確認の業務を専門業者に委託する場合があります。委託が確定した場合は、委託先と業務内容を本ポリシーで公開します。",
      rights:
        "利用者は個人情報を照会・訂正でき、保存された記録の削除や退会を求めることができます。マイプロフィールまたはサービスのお問い合わせ窓口から手続きできます。",
      securityItems: [
        "個人情報へのアクセス権限の最小化とアクセス記録の管理",
        "通信区間および重要情報の暗号化",
        "セキュリティ脆弱性の点検と不正アクセスの監視",
        "個人情報取扱者への教育と内部管理手続きの運用",
      ],
      consultationItems: [
        {
          heading: "匿名相談",
          description:
            "相談内容は原則として保存しません。利用者が保存に同意した場合に限り、アカウントの会話履歴に保管します。",
        },
        {
          heading: "画像・動画の分析",
          description:
            "アップロードされた写真・動画は、分析・検出結果とともにサーバーに保存され、記録を削除したり退会したりすると一緒に削除されます。ただし、Web逆画像検索のために外部の検索サービスへ送信された写真は、各サービスの方針に従って処理されます。記録を削除しない場合の自動削除の期間が決まり次第、本ポリシーを改定してお知らせします。",
        },
        {
          heading: "Web逆画像検索",
          description:
            "ディープフェイク検出の結果で「同意してWebで探す」または「同意してモニタリングを開始」を押した場合、同じ画像が掲載されたWebページを探すために写真が国外の検索サービスへ送信されます。検出結果の検索はSerpApi, LLC（米国、serpapi.com）を通じてGoogle検索へ送信され、ボタンを押したときに1回、サービスが推測できない一時アドレスで写真を最大5分間公開してSerpApiが取得できるようにし、検索が終わるとすぐにアドレスを閉じます。拡散モニタリングはGoogle LLC（米国、cloud.google.com）のGoogle Cloud Visionへ、開始時と停止するまで1日1回、暗号化された接続（HTTPS）で写真を直接送信します。サービスは検索で見つかったWebページのアドレスとタイトルを保存し、検出結果の検索記録は30日経過後に削除します。受領者が写真を保有・利用する期間は各社のプライバシーポリシーに従います。ボタンを押さなければ写真は送信されず、その場合はWeb検索の結果なしで検出結果のみを提供します。",
        },
        {
          heading: "専門機関へのおつなぎ",
          description:
            "電話でのおつなぎや外部サイトへの移動の際は、その機関のプライバシーポリシーが適用されます。",
        },
      ],
      contact:
        "個人情報に関するお問い合わせは、サービス内のお問い合わせ窓口で受け付けています。本ポリシーを変更する場合は、施行日より前にサービスのお知らせでご案内します。",
    },
    zh: {
      title: "隐私政策",
      description: "SIGNAL 珍视并保护你的个人信息，并清晰说明其处理过程。",
      toc: {
        collectedData: "1. 处理的个人信息",
        purpose: "2. 使用目的",
        retention: "3. 保存期限",
        thirdParty: "4. 向第三方提供",
        outsourcing: "5. 委托处理",
        rights: "6. 用户的权利",
        security: "7. 安全保障措施",
        consultationData: "8. 咨询与分析数据",
        contact: "9. 咨询与变更通知",
      },
      sections: {
        collectedData: "1. 处理的个人信息",
        purpose: "2. 个人信息的使用目的",
        retention: "3. 保存及使用期限",
        thirdParty: "4. 向第三方提供个人信息",
        outsourcing: "5. 个人信息处理业务的委托",
        rights: "6. 用户的权利及行使方式",
        security: "7. 个人信息安全保障措施",
        consultationData: "8. 咨询与分析数据的处理",
        contact: "9. 咨询与政策变更通知",
      },
      collectedIntro: "本服务仅在注册会员、保存记录及处理咨询所需的范围内处理个人信息。",
      tableCategory: "类别",
      tableItems: "处理项目",
      collectedRows: [
        {
          label: "会员信息",
          value:
            "姓名、电子邮箱、密码（加密保存）、年龄（根据注册时填写的出生日期计算，不保存出生日期）、性别、头像（可选）",
        },
        {
          label: "服务使用信息",
          value:
            "为分析与检测而上传的照片和视频、分析与检测记录、通过网络搜索找到的网页地址和标题、同意保存的咨询记录、举报文件记录",
        },
        { label: "自动生成信息", value: "访问记录、浏览器及设备信息、服务使用时间" },
      ],
      purposeItems: [
        "识别会员及管理账号",
        "提供AI图片分析与深度伪造检测结果",
        "保存经同意的咨询记录及举报文件记录",
        "排查错误、维护安全及改进服务",
        "回复咨询并发送服务相关通知",
      ],
      retention:
        "原则上，个人信息在使用目的达成后将立即删除。注销账号时，我们会删除账号信息和头像、上传的照片和视频（包括保护处理后的图片、监测基准图片、举报证据文件）、分析、检测、保护、监测、咨询、举报记录以及网络搜索记录；根据相关法律法规须保存的信息，将在规定期限内另行保存。但为进行网络以图搜图而发送到外部搜索服务的照片，将按照相应服务的政策处理（参见第8项）。",
      deletedRecords: {
        title: "用户删除的记录",
        description:
          "已删除的分析、检测、保护、监测、咨询、举报记录会连同其中使用的照片和视频文件一起删除，无法再在服务中查看。但为进行网络以图搜图而发送到外部搜索服务的照片，将按照相应服务的政策处理。",
      },
      thirdParty:
        "原则上不向外部提供用户的个人信息。仅在法律有特别规定或用户事先同意的情况下，在必要范围内提供。",
      outsourcing:
        "服务器运营、数据保管或身份验证业务可能委托给专业公司。委托确定后，将在本政策中公开受托公司及业务内容。",
      rights:
        "用户可以查询或修改个人信息，也可以申请删除已保存的记录或注销账号。可在“我的资料”或服务咨询渠道中办理。",
      securityItems: [
        "最小化个人信息访问权限并管理访问记录",
        "对传输过程及重要信息进行加密",
        "检查安全漏洞并监控异常访问",
        "对个人信息处理人员进行培训并执行内部管理流程",
      ],
      consultationItems: [
        {
          heading: "匿名咨询",
          description: "咨询内容默认不保存，仅在用户同意保存时才保存在账号的对话记录中。",
        },
        {
          heading: "图片与视频分析",
          description:
            "上传的照片和视频会与分析、检测结果一起保存在服务器上，删除记录或注销账号时会一并删除。但为进行网络以图搜图而发送到外部搜索服务的照片，将按照相应服务的政策处理。未删除的记录的自动删除期限确定后，我们将修订本政策并另行通知。",
        },
        {
          heading: "网络以图搜图",
          description:
            "如果您在深度伪造检测结果中点击“同意并在网络上查找”，或点击“同意并开始监测”，为查找刊登相同图片的网页，照片会被发送到境外的搜索服务。检测结果的搜索经由 SerpApi, LLC（美国，serpapi.com）发送到 Google 搜索，在您点击按钮时进行一次：服务会用无法猜测的临时地址公开照片最多 5 分钟，供 SerpApi 获取，搜索结束后立即关闭该地址。传播监测会在开始时以及停止前每天一次，通过加密连接（HTTPS）将照片直接发送到 Google LLC（美国，cloud.google.com）的 Google Cloud Vision。服务会保存通过搜索找到的网页地址和标题，检测结果的搜索记录将在 30 天后删除。接收方保存和使用照片的期限遵循各公司的隐私政策。如果您不点击按钮，照片不会被发送，此时仅提供不含网络搜索结果的检测结果。",
        },
        {
          heading: "对接专业机构",
          description: "通过电话联系或跳转至外部网站时，将适用该机构的隐私政策。",
        },
      ],
      contact:
        "个人信息相关咨询可通过服务内的咨询渠道提交。如本政策发生变更，将在生效日前通过服务公告进行通知。",
    },
  },
);
