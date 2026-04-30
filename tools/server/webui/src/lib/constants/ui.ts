import { Database, Settings, Search, SquarePen } from '@lucide/svelte';
import McpLogo from '$lib/components/app/mcp/McpLogo.svelte';
import type { Component } from 'svelte';

export const FORK_TREE_DEPTH_PADDING = 8;
export const SYSTEM_MESSAGE_PLACEHOLDER = '시스템 메시지';
export const APP_NAME = import.meta.env.VITE_PUBLIC_APP_NAME || 'Ellie';

export const ICON_STRIP_TRANSITION_DURATION = 150;
export const ICON_STRIP_TRANSITION_DELAY_MULTIPLIER = 50;

export interface DesktopIconStripItem {
	icon: Component;
	tooltip: string;
	route?: string;
	activeRouteId?: string;
	activeRoutePrefix?: string;
	keys?: string[];
}

export const SIDEBAR_ACTIONS_ITEMS: DesktopIconStripItem[] = [
	{ icon: SquarePen, tooltip: '새 대화', route: '?new_chat=true#/', keys: ['shift', 'cmd', 'o'] },
	{ icon: Search, tooltip: '검색', keys: ['cmd', 'k'] },
	{
		icon: McpLogo,
		tooltip: 'MCP 서버',
		route: '#/settings/mcp',
		activeRouteId: '/settings/mcp'
	},
	{
		icon: Database,
		tooltip: '가져오기 / 내보내기',
		route: '#/settings/import-export',
		activeRouteId: '/settings/import-export'
	},
	{
		icon: Settings,
		tooltip: '설정',
		route: '#/settings/chat/general',
		activeRoutePrefix: '/settings/chat'
	}
];
