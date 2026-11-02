import { defineMessages } from "@/shared/i18n/defineMessages";
import type { DeepfakeBand, DeepfakeVerdict, DetectionFailureReason } from "./detectApi";

interface FailureText {
  title: string;
  description: string;
}

interface ProvenanceText {
  tab: string;
  description: string;
}

export const detectMessages = defineMessages(
  {
    title: "얼굴 도용·딥페이크 탐지",
    description: "사진을 업로드하여 얼굴 도용 여부와 딥페이크 합성 여부를 확인할 수 있습니다.",
    start: "탐지 시작",
    selectFile: "파일을 선택해 주세요.",
    failed: "탐지에 실패했습니다.",
    retry: "다시 시도해 주세요.",
    verdict: {
      FAKE: "합성 흔적 발견",
      SUSPICIOUS: "합성 의심",
      REAL: "합성 흔적 없음",
    } as Record<DeepfakeVerdict, string>,
    verdictCaption: {
      FAKE: "얼굴 영역에서 합성 흔적이 감지되었습니다.",
      SUSPICIOUS: "합성 여부가 의심되는 부분이 있습니다.",
      REAL: "얼굴 영역에서 합성 흔적이 발견되지 않았습니다.",
    } as Record<DeepfakeVerdict, string>,
    failure: {
      NO_FACE_DETECTED: {
        title: "사진에서 얼굴을 찾지 못했어요.",
        description: "얼굴이 정면으로 잘 보이는 사진으로 다시 시도해 주세요.",
      },
      VIDEO_NOT_SUPPORTED: {
        title: "영상 탐지는 아직 지원하지 않아요.",
        description: "영상 속 얼굴이 잘 보이는 장면을 캡처한 사진으로 시도해 주세요.",
      },
      AI_SERVER_ERROR: {
        title: "AI 분석 서버에 일시적인 문제가 있어요.",
        description: "잠시 후 다시 시도해 주세요.",
      },
      TIMEOUT: { title: "분석 시간이 초과되었어요.", description: "잠시 후 다시 시도해 주세요." },
    } as Record<DetectionFailureReason, FailureText>,
    evidenceType: {
      BLINK_PATTERN_ANOMALY: "눈 깜빡임 패턴",
      COMPRESSION_ARTIFACT: "압축 아티팩트",
      FACE_BOUNDARY: "얼굴 경계",
      LIGHTING_INCONSISTENCY: "조명 일관성",
      SKIN_TEXTURE: "피부 질감",
      MOUTH_SYNC: "입 주변 움직임",
    } as Record<string, string>,
    evidenceFallbackTab: (index: number) => `근거 ${index}`,
    evidenceNoDescription: "세부 설명이 제공되지 않았습니다.",
    noEvidenceTab: "분석 결과",
    noEvidenceDescription: "탐지된 세부 근거가 없습니다.",
    fallbackNote:
      "⚠️ AI 모델 응답에 실패해 실제 이미지 분석이 아닌 참고용 추정치가 표시되고 있습니다.",
    modelNote: "AI 모델이 이미지를 분석한 결과입니다.",
    comingSoon: "준비 중",
    faceTheftCaption: "얼굴 도용 웹 검색 탐지는 아직 준비 중인 기능입니다.",
    band: {
      LOW: "합성 흔적을 찾지 못함",
      UNCERTAIN: "합성 가능성 불확실",
      HIGH: "합성 가능성 높음",
      UNDETERMINED: "판단할 수 없음",
    } as Record<DeepfakeBand, string>,
    bandCaption: {
      LOW: "합성 흔적을 찾지 못했습니다. 다만 진짜임을 보증하지는 않습니다.",
      UNCERTAIN: "판단이 어렵습니다. 합성 가능성이 불확실하니 아래 안내를 참고해 주세요.",
      HIGH: "합성 가능성이 높습니다.",
      UNDETERMINED: "이 사진은 판단할 수 없습니다. 다른 사진으로 다시 시도해 주세요.",
    } as Record<DeepfakeBand, string>,
    undeterminedReason: {
      LOW_RESOLUTION:
        "이미지가 너무 작아 정확한 분석이 어렵습니다. 원본 사진으로 다시 시도해 주세요.",
    } as Record<string, string>,
    provenanceCaption: {
      HIGH: "이미지 파일에 AI 생성 도구의 기록이 남아 있습니다.",
      UNCERTAIN: "이미지 파일에 일부를 AI로 편집했다는 표시가 있습니다.",
    } as Partial<Record<DeepfakeBand, string>>,
    provenance: {
      GENERATOR_METADATA: {
        tab: "생성 도구 기록",
        description: "이미지 파일에 AI 생성 도구로 만들었다는 기록이 남아 있습니다.",
      },
      AI_SOURCE_DECLARED: {
        tab: "AI 생성 표시",
        description: "이미지 파일에 AI로 생성한 콘텐츠라는 표시가 있습니다.",
      },
      AI_EDIT_DECLARED: {
        tab: "AI 편집 표시",
        description:
          "이미지 파일에 일부를 AI로 편집·합성했다는 표시가 있습니다. 이미지 전체를 AI로 만들었다는 뜻은 아닙니다.",
      },
      C2PA_MANIFEST: {
        tab: "콘텐츠 자격 증명",
        description:
          "이미지 파일에 콘텐츠 자격 증명(C2PA)이 들어 있습니다. 서명은 검증하지 않았으며 참고용입니다.",
      },
    } as Record<string, ProvenanceText>,
    provenanceFallbackTab: "출처 신호",
    referenceNotice:
      "이 결과는 자동 분석으로 얻은 참고용 정보이며 사진의 진위를 보증하지 않습니다. 피해가 걱정된다면 익명 상담이나 신고 문서 작성을 이용해 보세요.",
    modelLabel: (name: string, version: string | null) =>
      `분석 모델: ${name}${version ? ` (${version})` : ""}`,
    result: {
      title: "탐지 결과",
      faceTheft: "얼굴 도용 여부",
      risk: "위험도",
      deepfake: "딥페이크 여부",
      probability: "합성 가능성",
      bandLevel: {
        LOW: "낮음",
        UNCERTAIN: "불확실",
        HIGH: "높음",
        UNDETERMINED: "-",
      } as Record<DeepfakeBand, string>,
      chat: "익명 상담하기",
      report: "신고 문서 작성하기",
      evidenceTitle: "AI 판단 근거 하이라이트",
      overall: "종합 위험도",
      overallScoreLabel: (score: number | null) =>
        score === null ? "종합 위험도: 점수 없음" : `종합 위험도 ${score}점`,
      confidence: "모델 판단 신뢰도",
      unsupported: "준비 중인 기능입니다",
      webTitle: "도용 의심 이미지 (웹 검색 결과)",
      webUnsupported: "웹 검색 기반 도용 탐지는 아직 준비 중인 기능입니다.",
      viewAll: "모두 보기",
    },
    upload: {
      detecting: "탐지 중...",
      title: "사진 업로드",
      fileTypes: "JPG, PNG 파일 지원",
      browse: "파일 찾기",
    },
  },
  {
    en: {
      title: "Face Theft & Deepfake Detection",
      description: "Upload a photo to check for face theft and deepfake synthesis.",
      start: "Start detection",
      selectFile: "Please select a file.",
      failed: "Detection failed.",
      retry: "Please try again.",
      verdict: {
        FAKE: "Synthesis detected",
        SUSPICIOUS: "Possible synthesis",
        REAL: "No synthesis found",
      },
      verdictCaption: {
        FAKE: "Signs of synthesis were detected in the face area.",
        SUSPICIOUS: "Some parts look like they may be synthesized.",
        REAL: "No signs of synthesis were found in the face area.",
      },
      failure: {
        NO_FACE_DETECTED: {
          title: "We couldn't find a face in the photo.",
          description: "Try again with a photo that clearly shows the face from the front.",
        },
        VIDEO_NOT_SUPPORTED: {
          title: "Video detection isn't supported yet.",
          description: "Try a photo captured from a scene where the face is clearly visible.",
        },
        AI_SERVER_ERROR: {
          title: "The AI analysis server is having a temporary problem.",
          description: "Please try again in a moment.",
        },
        TIMEOUT: { title: "The analysis timed out.", description: "Please try again in a moment." },
      },
      evidenceType: {
        BLINK_PATTERN_ANOMALY: "Blink pattern",
        COMPRESSION_ARTIFACT: "Compression artifacts",
        FACE_BOUNDARY: "Face boundary",
        LIGHTING_INCONSISTENCY: "Lighting consistency",
        SKIN_TEXTURE: "Skin texture",
        MOUTH_SYNC: "Mouth movement",
      },
      evidenceFallbackTab: (index) => `Evidence ${index}`,
      evidenceNoDescription: "No detailed description was provided.",
      noEvidenceTab: "Result",
      noEvidenceDescription: "No detailed evidence was detected.",
      fallbackNote:
        "⚠️ The AI model didn't respond, so this shows a reference estimate rather than an actual image analysis.",
      modelNote: "This is the result of the AI model's analysis of your image.",
      comingSoon: "Coming soon",
      faceTheftCaption: "Web-search-based face theft detection is coming soon.",
      band: {
        LOW: "No signs of synthesis found",
        UNCERTAIN: "Uncertain likelihood of synthesis",
        HIGH: "High likelihood of synthesis",
        UNDETERMINED: "Can't be determined",
      },
      bandCaption: {
        LOW: "We didn't find signs of synthesis, but that doesn't guarantee it's authentic.",
        UNCERTAIN: "It's hard to tell whether this was synthesized. Please see the guidance below.",
        HIGH: "This is likely to be synthesized.",
        UNDETERMINED: "We couldn't assess this photo. Please try again with a different photo.",
      },
      undeterminedReason: {
        LOW_RESOLUTION:
          "The image is too small to analyze accurately. Please try again with the original photo.",
      },
      provenanceCaption: {
        HIGH: "The image file contains a record of an AI generation tool.",
        UNCERTAIN: "The image file is marked as partly edited with AI.",
      },
      provenance: {
        GENERATOR_METADATA: {
          tab: "Generator record",
          description:
            "The image file contains a record that it was made with an AI generation tool.",
        },
        AI_SOURCE_DECLARED: {
          tab: "AI-generated label",
          description: "The image file is labeled as AI-generated content.",
        },
        AI_EDIT_DECLARED: {
          tab: "AI edit label",
          description:
            "The image file is marked as partly edited or composited with AI. This doesn't mean the whole image was made by AI.",
        },
        C2PA_MANIFEST: {
          tab: "Content Credentials",
          description:
            "The image file includes Content Credentials (C2PA). The signature wasn't verified, so treat this as reference only.",
        },
      },
      provenanceFallbackTab: "Source signal",
      referenceNotice:
        "This result comes from automated analysis, is for reference only, and doesn't guarantee whether the photo is authentic. If you're worried about harm, try talking anonymously or writing a report.",
      modelLabel: (name, version) => `Model: ${name}${version ? ` (${version})` : ""}`,
      result: {
        title: "Detection results",
        faceTheft: "Face theft",
        risk: "Risk",
        deepfake: "Deepfake",
        probability: "Synthetic likelihood",
        bandLevel: { LOW: "Low", UNCERTAIN: "Uncertain", HIGH: "High", UNDETERMINED: "-" },
        chat: "Talk anonymously",
        report: "Write a report",
        evidenceTitle: "AI evidence highlights",
        overall: "Overall risk",
        overallScoreLabel: (score) =>
          score === null ? "Overall risk: no score" : `Overall risk ${score} out of 100`,
        confidence: "Model confidence",
        unsupported: "This feature is coming soon",
        webTitle: "Possible stolen images (web search)",
        webUnsupported: "Web-search-based theft detection is coming soon.",
        viewAll: "View all",
      },
      upload: {
        detecting: "Detecting...",
        title: "Upload photo",
        fileTypes: "Supports JPG and PNG",
        browse: "Browse files",
      },
    },
    ja: {
      title: "顔の盗用・ディープフェイク検出",
      description: "写真をアップロードして、顔の盗用やディープフェイク合成の有無を確認できます。",
      start: "検出を開始",
      selectFile: "ファイルを選択してください。",
      failed: "検出に失敗しました。",
      retry: "もう一度お試しください。",
      verdict: { FAKE: "合成の痕跡あり", SUSPICIOUS: "合成の疑い", REAL: "合成の痕跡なし" },
      verdictCaption: {
        FAKE: "顔の領域で合成の痕跡が検出されました。",
        SUSPICIOUS: "合成が疑われる部分があります。",
        REAL: "顔の領域で合成の痕跡は見つかりませんでした。",
      },
      failure: {
        NO_FACE_DETECTED: {
          title: "写真から顔を見つけられませんでした。",
          description: "顔が正面からはっきり写っている写真でもう一度お試しください。",
        },
        VIDEO_NOT_SUPPORTED: {
          title: "動画の検出にはまだ対応していません。",
          description: "動画内で顔がよく見える場面をキャプチャした写真でお試しください。",
        },
        AI_SERVER_ERROR: {
          title: "AI分析サーバーに一時的な問題が発生しています。",
          description: "しばらくしてからもう一度お試しください。",
        },
        TIMEOUT: {
          title: "分析がタイムアウトしました。",
          description: "しばらくしてからもう一度お試しください。",
        },
      },
      evidenceType: {
        BLINK_PATTERN_ANOMALY: "まばたきのパターン",
        COMPRESSION_ARTIFACT: "圧縮アーティファクト",
        FACE_BOUNDARY: "顔の境界",
        LIGHTING_INCONSISTENCY: "照明の一貫性",
        SKIN_TEXTURE: "肌の質感",
        MOUTH_SYNC: "口元の動き",
      },
      evidenceFallbackTab: (index) => `根拠 ${index}`,
      evidenceNoDescription: "詳しい説明は提供されていません。",
      noEvidenceTab: "分析結果",
      noEvidenceDescription: "検出された詳細な根拠はありません。",
      fallbackNote:
        "⚠️ AIモデルの応答に失敗したため、実際の画像分析ではなく参考用の推定値を表示しています。",
      modelNote: "AIモデルが画像を分析した結果です。",
      comingSoon: "準備中",
      faceTheftCaption: "Web検索による顔の盗用検出は準備中の機能です。",
      band: {
        LOW: "合成の痕跡が見つからない",
        UNCERTAIN: "合成の可能性が不確か",
        HIGH: "合成の可能性が高い",
        UNDETERMINED: "判断できません",
      },
      bandCaption: {
        LOW: "合成の痕跡は見つかりませんでした。ただし、本物であることを保証するものではありません。",
        UNCERTAIN:
          "判断が難しい結果です。合成の可能性がはっきりしないため、下の案内をご確認ください。",
        HIGH: "合成の可能性が高いです。",
        UNDETERMINED: "この写真は判断できません。別の写真でもう一度お試しください。",
      },
      undeterminedReason: {
        LOW_RESOLUTION:
          "画像が小さすぎるため、正確な分析が難しいです。元の写真でもう一度お試しください。",
      },
      provenanceCaption: {
        HIGH: "画像ファイルにAI生成ツールの記録が残っています。",
        UNCERTAIN: "画像ファイルに一部をAIで編集したという表示があります。",
      },
      provenance: {
        GENERATOR_METADATA: {
          tab: "生成ツールの記録",
          description: "画像ファイルにAI生成ツールで作成したという記録が残っています。",
        },
        AI_SOURCE_DECLARED: {
          tab: "AI生成の表示",
          description: "画像ファイルにAIで生成したコンテンツであるという表示があります。",
        },
        AI_EDIT_DECLARED: {
          tab: "AI編集の表示",
          description:
            "画像ファイルに一部をAIで編集・合成したという表示があります。画像全体をAIで作成したという意味ではありません。",
        },
        C2PA_MANIFEST: {
          tab: "コンテンツ認証情報",
          description:
            "画像ファイルにコンテンツ認証情報（C2PA）が含まれています。署名は検証していないため、参考情報です。",
        },
      },
      provenanceFallbackTab: "出所シグナル",
      referenceNotice:
        "この結果は自動分析による参考情報であり、写真の真偽を保証するものではありません。被害が心配な場合は、匿名相談や通報書類の作成をご利用ください。",
      modelLabel: (name, version) => `分析モデル: ${name}${version ? ` (${version})` : ""}`,
      result: {
        title: "検出結果",
        faceTheft: "顔の盗用",
        risk: "危険度",
        deepfake: "ディープフェイク",
        probability: "合成の可能性",
        bandLevel: { LOW: "低い", UNCERTAIN: "不確か", HIGH: "高い", UNDETERMINED: "-" },
        chat: "匿名で相談する",
        report: "通報書類を作成する",
        evidenceTitle: "AI判断根拠のハイライト",
        overall: "総合危険度",
        overallScoreLabel: (score) =>
          score === null ? "総合危険度: スコアなし" : `総合危険度 ${score}点`,
        confidence: "モデルの判断信頼度",
        unsupported: "準備中の機能です",
        webTitle: "盗用の疑いがある画像（Web検索結果）",
        webUnsupported: "Web検索による盗用検出は準備中の機能です。",
        viewAll: "すべて見る",
      },
      upload: {
        detecting: "検出中...",
        title: "写真をアップロード",
        fileTypes: "JPG・PNGに対応",
        browse: "ファイルを選択",
      },
    },
    zh: {
      title: "面部盗用·深度伪造检测",
      description: "上传照片，即可检查是否存在面部盗用或深度伪造合成。",
      start: "开始检测",
      selectFile: "请选择文件。",
      failed: "检测失败。",
      retry: "请重试。",
      verdict: { FAKE: "发现合成痕迹", SUSPICIOUS: "疑似合成", REAL: "未发现合成痕迹" },
      verdictCaption: {
        FAKE: "在面部区域检测到合成痕迹。",
        SUSPICIOUS: "部分区域疑似经过合成。",
        REAL: "在面部区域未发现合成痕迹。",
      },
      failure: {
        NO_FACE_DETECTED: {
          title: "未能在照片中找到面部。",
          description: "请使用正面清晰拍摄面部的照片重试。",
        },
        VIDEO_NOT_SUPPORTED: {
          title: "暂不支持视频检测。",
          description: "请截取视频中面部清晰的画面后用照片重试。",
        },
        AI_SERVER_ERROR: { title: "AI分析服务器暂时出现问题。", description: "请稍后再试。" },
        TIMEOUT: { title: "分析超时。", description: "请稍后再试。" },
      },
      evidenceType: {
        BLINK_PATTERN_ANOMALY: "眨眼模式",
        COMPRESSION_ARTIFACT: "压缩伪影",
        FACE_BOUNDARY: "面部边界",
        LIGHTING_INCONSISTENCY: "光照一致性",
        SKIN_TEXTURE: "皮肤质感",
        MOUTH_SYNC: "嘴部动作",
      },
      evidenceFallbackTab: (index) => `依据 ${index}`,
      evidenceNoDescription: "未提供详细说明。",
      noEvidenceTab: "分析结果",
      noEvidenceDescription: "未检测到详细依据。",
      fallbackNote: "⚠️ AI模型未能响应，当前显示的是参考估算值，而非实际图片分析结果。",
      modelNote: "这是AI模型对图片的分析结果。",
      comingSoon: "即将推出",
      faceTheftCaption: "基于网络搜索的面部盗用检测功能即将推出。",
      band: {
        LOW: "未发现合成痕迹",
        UNCERTAIN: "合成可能性不确定",
        HIGH: "合成可能性高",
        UNDETERMINED: "无法判断",
      },
      bandCaption: {
        LOW: "未发现合成痕迹，但这并不能保证照片是真实的。",
        UNCERTAIN: "难以判断是否经过合成，请参考下方的说明。",
        HIGH: "合成的可能性较高。",
        UNDETERMINED: "无法判断这张照片，请换一张照片重试。",
      },
      undeterminedReason: {
        LOW_RESOLUTION: "图片太小，难以准确分析。请使用原始照片重试。",
      },
      provenanceCaption: {
        HIGH: "图片文件中留有AI生成工具的记录。",
        UNCERTAIN: "图片文件中带有部分内容经AI编辑的标记。",
      },
      provenance: {
        GENERATOR_METADATA: {
          tab: "生成工具记录",
          description: "图片文件中留有使用AI生成工具制作的记录。",
        },
        AI_SOURCE_DECLARED: {
          tab: "AI生成标记",
          description: "图片文件中带有AI生成内容的标记。",
        },
        AI_EDIT_DECLARED: {
          tab: "AI编辑标记",
          description: "图片文件中带有部分内容经AI编辑或合成的标记。这并不表示整张图片都由AI生成。",
        },
        C2PA_MANIFEST: {
          tab: "内容凭证",
          description: "图片文件中包含内容凭证（C2PA）。签名未经验证，仅供参考。",
        },
      },
      provenanceFallbackTab: "来源信号",
      referenceNotice:
        "此结果是自动分析得出的参考信息，不能保证照片的真伪。如果担心受到伤害，可以使用匿名咨询或撰写举报文件。",
      modelLabel: (name, version) => `分析模型：${name}${version ? `（${version}）` : ""}`,
      result: {
        title: "检测结果",
        faceTheft: "面部盗用",
        risk: "风险",
        deepfake: "深度伪造",
        probability: "合成可能性",
        bandLevel: { LOW: "低", UNCERTAIN: "不确定", HIGH: "高", UNDETERMINED: "-" },
        chat: "匿名咨询",
        report: "撰写举报文件",
        evidenceTitle: "AI判断依据要点",
        overall: "综合风险",
        overallScoreLabel: (score) => (score === null ? "综合风险：无分数" : `综合风险 ${score}分`),
        confidence: "模型判断可信度",
        unsupported: "该功能即将推出",
        webTitle: "疑似被盗用的图片（网络搜索结果）",
        webUnsupported: "基于网络搜索的盗用检测功能即将推出。",
        viewAll: "查看全部",
      },
      upload: {
        detecting: "正在检测...",
        title: "上传照片",
        fileTypes: "支持 JPG、PNG 文件",
        browse: "选择文件",
      },
    },
  },
);
