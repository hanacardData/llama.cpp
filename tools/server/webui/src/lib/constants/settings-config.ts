import { ColorMode } from '$lib/enums/ui';
import { Monitor, Moon, Sun } from '@lucide/svelte';

export const SETTING_CONFIG_DEFAULT: Record<string, string | number | boolean | undefined> = {
	// Note: in order not to introduce breaking changes, please keep the same data type (number, string, etc) if you want to change the default value.
	// Do not use nested objects, keep it single level. Prefix the key if you need to group them.
	apiKey: '',
	systemMessage: '',
	showSystemMessage: true,
	theme: ColorMode.SYSTEM,
	showThoughtInProgress: true,
	disableReasoningParsing: false,
	excludeReasoningFromContext: false,
	showRawOutputSwitch: false,
	keepStatsVisible: false,
	showMessageStats: true,
	askForTitleConfirmation: false,
	titleGenerationUseFirstLine: false,
	pasteLongTextToFileLen: 2500,
	copyTextAttachmentsAsPlainText: false,
	pdfAsImage: false,
	disableAutoScroll: false,
	renderUserContentAsMarkdown: false,
	alwaysShowSidebarOnDesktop: false,
	autoShowSidebarOnNewChat: true,
	sendOnEnter: true,
	autoMicOnEmpty: false,
	fullHeightCodeBlocks: false,
	showRawModelNames: false,
	mcpServers: '[]',
	mcpServerUsageStats: '{}', // JSON object: { [serverId]: usageCount }
	agenticMaxTurns: 10,
	agenticMaxToolPreviewLines: 25,
	showToolCallInProgress: false,
	alwaysShowAgenticTurns: false,
	// sampling params: empty means "use server default"
	// the server / preset is the source of truth
	// empty values are shown as placeholders from /props in the UI
	// and are NOT sent in API requests, letting the server decide
	samplers: '',
	backend_sampling: false,
	temperature: undefined,
	dynatemp_range: undefined,
	dynatemp_exponent: undefined,
	top_k: undefined,
	top_p: undefined,
	min_p: undefined,
	xtc_probability: undefined,
	xtc_threshold: undefined,
	typ_p: undefined,
	repeat_last_n: undefined,
	repeat_penalty: undefined,
	presence_penalty: undefined,
	frequency_penalty: undefined,
	dry_multiplier: undefined,
	dry_base: undefined,
	dry_allowed_length: undefined,
	dry_penalty_last_n: undefined,
	max_tokens: undefined,
	custom: '', // custom json-stringified object
	preEncodeConversation: false,
	// experimental features
	pyInterpreterEnabled: false,
	enableContinueGeneration: false
};

export const SETTING_CONFIG_INFO: Record<string, string> = {
	apiKey: '서버 실행 시 <code>--api-key</code> 옵션을 사용하는 경우 API 키를 설정하세요.',
	systemMessage: '모델의 행동 방식을 정의하는 시작 메시지입니다.',
	showSystemMessage: '각 대화의 상단에 시스템 메시지를 표시합니다.',
	theme:
		'인터페이스의 색상 테마를 선택합니다. 시스템 설정(기기 설정 따름), 라이트 모드, 다크 모드 중에서 선택할 수 있습니다.',
	pasteLongTextToFileLen:
		'긴 텍스트를 붙여넣을 때 파일로 변환됩니다. 이 매개변수 값을 설정하여 파일로 변환할 최소 길이를 조절할 수 있습니다. 0으로 설정하면 이 기능을 비활성화합니다.',
	copyTextAttachmentsAsPlainText:
		'텍스트 첨부 파일이 포함된 메시지를 복사할 때, 첨부 파일 형식 대신 하나의 일반 텍스트 문자열로 결합하여 복사합니다.',
	samplers:
		'샘플러가 적용되는 순서를 설정합니다. 기본값은 "top_k;typ_p;top_p;min_p;temperature" 순서입니다.',
	backend_sampling:
		'백엔드 기반 샘플러를 활성화합니다. 활성화하면 지원되는 샘플러가 가속기 백엔드에서 실행되어 샘플링 속도가 빨라집니다.',
	temperature:
		'출력 토큰의 확률 분포에 영향을 주어 생성된 텍스트의 무작위성을 조절합니다. 값이 높을수록 더 무작위적이고, 낮을수록 더 집중된 결과를 만듭니다.',
	dynatemp_range:
		'동적 온도 샘플러용 설정입니다. 토큰의 엔트로피에 따라 온도를 조절하는 범위에 더해지는 값입니다.',
	dynatemp_exponent:
		'동적 온도 샘플러용 설정입니다. 가장 확률이 높은 토큰을 기반으로 확률 재분배를 부드럽게 만듭니다.',
	top_k: '확률이 가장 높은 k개의 토큰만 남깁니다.',
	top_p: '누적 확률이 최소 p 이상인 토큰들로 제한합니다.',
	min_p:
		'가장 확률이 높은 토큰의 확률을 기준으로, 고려할 토큰의 최소 확률을 제한합니다.',
	xtc_probability:
		'XTC 샘플러는 상위 토큰을 제외합니다. 이 매개변수는 토큰을 제외할 확률을 조절합니다. 0은 XTC를 비활성화합니다.',
	xtc_threshold:
		'XTC 샘플러가 상위 토큰을 제외할 때, 토큰을 제외하기 위해 필요한 최소 확률을 설정합니다.',
	typ_p: '로그 확률과 엔트로피의 차이를 바탕으로 토큰을 정렬하고 제한합니다.',
	repeat_last_n: '반복 페널티를 적용할 때 고려할 마지막 n개의 토큰 수입니다.',
	repeat_penalty: '생성된 텍스트에서 토큰 시퀀스의 반복을 조절합니다.',
	presence_penalty: '토큰이 출력에 이미 나타났는지 여부에 따라 토큰을 제한합니다.',
	frequency_penalty: '토큰이 출력에 나타난 빈도에 따라 토큰을 제한합니다.',
	dry_multiplier:
		'DRY 샘플링은 긴 문맥에서도 텍스트 반복을 줄여줍니다. 이 매개변수는 DRY 샘플링 승수를 설정합니다.',
	dry_base:
		'DRY 샘플링을 위한 베이스 값을 설정합니다.',
	dry_allowed_length:
		'DRY 샘플링에서 허용되는 길이를 설정합니다.',
	dry_penalty_last_n:
		'마지막 n개의 토큰에 대한 DRY 페널티를 설정합니다.',
	max_tokens: '출력당 최대 토큰 수입니다. 제한을 없애려면 -1을 사용하세요.',
	custom: 'API로 보낼 사용자 정의 JSON 매개변수입니다. 유효한 JSON 형식이어야 합니다.',
	showThoughtInProgress: '메시지 생성 시 기본적으로 생각 과정을 펼쳐서 보여줍니다.',
	disableReasoningParsing:
		'서버에서 추론(thinking) 토큰을 별도 필드로 추출하지 않고 인라인으로 반환하도록 reasoning_format=none을 보냅니다.',
	excludeReasoningFromContext:
		'이전 메시지를 보낼 때 생각 과정을 제거합니다. 비활성화하면 reasoning_content 필드를 통해 생각 과정이 다시 전송되어 모델이 이전 대화의 사고 체계를 볼 수 있습니다.',
	showRawOutputSwitch:
		'메시지를 마크다운 형식 대신 일반 텍스트로 표시할 수 있는 토글 버튼을 보여줍니다.',
	keepStatsVisible: '생성이 끝난 후에도 처리 통계를 계속 표시합니다.',
	showMessageStats:
		'각 어시스턴트 메시지 아래에 생성 통계(토큰/초, 토큰 수, 소요 시간)를 표시합니다.',
	askForTitleConfirmation:
		'첫 번째 메시지를 수정할 때 대화 제목을 자동으로 변경하기 전 확인을 요청합니다.',
	titleGenerationUseFirstLine:
		'프롬프트의 첫 번째 비어 있지 않은 줄만 사용하여 대화 제목을 생성합니다.',
	pdfAsImage:
		'PDF를 텍스트 대신 이미지로 분석합니다. 비전 모델이 아닌 경우 자동으로 텍스트 처리로 전환됩니다.',
	disableAutoScroll:
		'메시지가 스트리밍되는 동안 자동 스크롤을 비활성화하여 뷰포트 위치를 직접 제어할 수 있게 합니다.',
	renderUserContentAsMarkdown: '채팅에서 사용자 메시지를 마크다운 형식으로 렌더링합니다.',
	alwaysShowSidebarOnDesktop:
		'데스크톱에서 사이드바를 자동으로 숨기지 않고 항상 표시합니다.',
	autoShowSidebarOnNewChat:
		'새 채팅을 시작할 때 자동으로 사이드바를 보여줍니다. 비활성화하면 클릭하기 전까지 사이드바가 숨겨진 상태로 유지됩니다.',
	sendOnEnter:
		'Enter를 눌러 메시지를 전송하고 Shift + Enter로 줄바꿈을 합니다. 비활성화하면 Ctrl/Cmd + Enter를 사용합니다.',
	autoMicOnEmpty:
		'오디오 모달리티를 지원하는 모델의 경우, 입력창이 비어 있을 때 전송 버튼 대신 마이크 버튼을 자동으로 보여줍니다.',
	fullHeightCodeBlocks:
		'코드 블록을 높이 제한 없이 항상 원래 높이대로 표시합니다.',
	showRawModelNames:
		'파싱된 이름 대신 전체 모델 식별자(예: "ggml-org/GLM-4.7-Flash-GGUF:Q8_0")를 표시합니다.',
	mcpServers:
		'MCP 서버를 JSON 리스트 형식으로 설정합니다. MCP 클라이언트 설정 섹션의 양식을 사용하여 편집하세요.',
	mcpServerUsageStats:
		'MCP 서버 사용 통계입니다. 각 서버의 도구가 몇 번 사용되었는지 추적합니다.',
	agenticMaxTurns:
		'무한 루프를 방지하기 위해 중단하기 전까지 도구를 실행할 수 있는 최대 주기 횟수입니다.',
	agenticMaxToolPreviewLines:
		'도구 출력 미리보기에 표시될 줄 수(마지막 N줄)입니다. 에이전트 루프가 완료된 후에는 이 미리보기와 최종 LLM 응답만 유지됩니다.',
	showToolCallInProgress:
		'도구 호출 실행 중에 세부 정보를 자동으로 펼치고, 완료 후에도 펼쳐진 상태를 유지합니다.',
	pyInterpreterEnabled:
		'Pyodide를 사용하여 Python 인터프리터를 활성화합니다. 마크다운 코드 블록에서 Python 코드를 실행할 수 있습니다.',
	preEncodeConversation:
		'각 응답 후에 대화를 다시 제출하여 서버 KV 캐시를 미리 채웁니다. 응답을 읽는 동안 프롬프트가 미리 인코딩되므로 다음 턴이 더 빨라집니다.',
	enableContinueGeneration:
		'어시스턴트 메시지에 "계속하기" 버튼을 활성화합니다. 현재 추론 모델이 아닌 경우에만 작동합니다.'
};

export const SETTINGS_COLOR_MODES_CONFIG = [
	{ value: ColorMode.SYSTEM, label: '시스템', icon: Monitor },
	{ value: ColorMode.LIGHT, label: '라이트', icon: Sun },
	{ value: ColorMode.DARK, label: '다크', icon: Moon }
];
