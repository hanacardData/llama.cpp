<script lang="ts">
	import type { Component } from 'svelte';
	import { Download, Upload, Trash2 } from '@lucide/svelte';
	import { Button, type ButtonVariant } from '$lib/components/ui/button';
	import { DialogConversationSelection, DialogConfirmation } from '$lib/components/app';
	import { createMessageCountMap } from '$lib/utils';
	import { conversationsStore, conversations } from '$lib/stores/conversations.svelte';
	import { toast } from 'svelte-sonner';
	import { fade } from 'svelte/transition';
	import { ConversationSelectionMode, HtmlInputType, FileExtensionText } from '$lib/enums';

	interface SectionOpts {
		wrapperClass?: string;
		titleClass?: string;
		buttonVariant?: ButtonVariant;
		buttonClass?: string;
		summary?: { show: boolean; verb: string; items: DatabaseConversation[] };
	}

	let exportedConversations = $state<DatabaseConversation[]>([]);
	let importedConversations = $state<DatabaseConversation[]>([]);
	let showExportSummary = $state(false);
	let showImportSummary = $state(false);

	let showExportDialog = $state(false);
	let showImportDialog = $state(false);
	let availableConversations = $state<DatabaseConversation[]>([]);
	let messageCountMap = $state<Map<string, number>>(new Map());
	let fullImportData = $state<Array<{ conv: DatabaseConversation; messages: DatabaseMessage[] }>>(
		[]
	);

	// Delete functionality state
	let showDeleteDialog = $state(false);

	async function handleExportClick() {
		try {
			const allConversations = conversations();
			if (allConversations.length === 0) {
				toast.info('내보낼 대화가 없습니다');
				return;
			}

			const conversationsWithMessages = await Promise.all(
				allConversations.map(async (conv: DatabaseConversation) => {
					const messages = await conversationsStore.getConversationMessages(conv.id);
					return { conv, messages };
				})
			);

			messageCountMap = createMessageCountMap(conversationsWithMessages);
			availableConversations = allConversations;
			showExportDialog = true;
		} catch (err) {
			console.error('Failed to load conversations:', err);
			alert('대화를 불러오지 못했습니다');
		}
	}

	async function handleExportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const allData: ExportedConversations = await Promise.all(
				selectedConversations.map(async (conv) => {
					const messages = await conversationsStore.getConversationMessages(conv.id);
					return { conv: $state.snapshot(conv), messages: $state.snapshot(messages) };
				})
			);

			conversationsStore.downloadConversationFile(allData);

			exportedConversations = selectedConversations;
			showExportSummary = true;
			showImportSummary = false;
			showExportDialog = false;
		} catch (err) {
			console.error('Export failed:', err);
			alert('대화 내보내기에 실패했습니다');
		}
	}

	async function handleImportClick() {
		try {
			const input = document.createElement('input');

			input.type = HtmlInputType.FILE;
			input.accept = FileExtensionText.JSON;

			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement)?.files?.[0];
				if (!file) return;

				try {
					const text = await file.text();
					const parsedData = JSON.parse(text);
					let importedData: ExportedConversations;

					if (Array.isArray(parsedData)) {
						importedData = parsedData;
					} else if (
						parsedData &&
						typeof parsedData === 'object' &&
						'conv' in parsedData &&
						'messages' in parsedData
					) {
						// Single conversation object
						importedData = [parsedData];
					} else {
						throw new Error('유효하지 않은 파일 형식: 대화 배열 또는 단일 대화 개체가 필요합니다');
					}

					fullImportData = importedData;
					availableConversations = importedData.map(
						(item: { conv: DatabaseConversation; messages: DatabaseMessage[] }) => item.conv
					);
					messageCountMap = createMessageCountMap(importedData);
					showImportDialog = true;
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : '알 수 없는 오류';

					console.error('Failed to parse file:', err);
					alert(`파일 분석에 실패했습니다: ${message}`);
				}
			};

			input.click();
		} catch (err) {
			console.error('Import failed:', err);
			alert('대화 가져오기에 실패했습니다');
		}
	}

	async function handleImportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const selectedIds = new Set(selectedConversations.map((c) => c.id));
			const selectedData = $state
				.snapshot(fullImportData)
				.filter((item) => selectedIds.has(item.conv.id));

			await conversationsStore.importConversationsData(selectedData);

			importedConversations = selectedConversations;
			showImportSummary = true;
			showExportSummary = false;
			showImportDialog = false;
		} catch (err) {
			console.error('Import failed:', err);
			alert('대화 가져오기에 실패했습니다. 파일 형식을 확인해 주세요.');
		}
	}

	async function handleDeleteAllClick() {
		try {
			const allConversations = conversations();

			if (allConversations.length === 0) {
				toast.info('삭제할 대화가 없습니다');
				return;
			}

			showDeleteDialog = true;
		} catch (err) {
			console.error('Failed to load conversations for deletion:', err);
			toast.error('대화를 불러오지 못했습니다');
		}
	}

	async function handleDeleteAllConfirm() {
		try {
			await conversationsStore.deleteAll();

			showDeleteDialog = false;
		} catch (err) {
			console.error('Failed to delete conversations:', err);
		}
	}

	function handleDeleteAllCancel() {
		showDeleteDialog = false;
	}
</script>

{#snippet summaryList(show: boolean, verb: string, items: DatabaseConversation[])}
	{#if show && items.length > 0}
		<div class="mt-4 grid overflow-x-auto rounded-lg border border-border/50 bg-muted/30 p-4">
			<h5 class="mb-2 text-sm font-medium">
				{items.length}개의 대화를 {verb}했습니다
			</h5>

			<ul class="space-y-1 text-sm text-muted-foreground">
				{#each items.slice(0, 10) as conv (conv.id)}
					<li class="truncate">• {conv.name || '제목 없는 대화'}</li>
				{/each}

				{#if items.length > 10}
					<li class="italic">... 외 {items.length - 10}개 더 보기</li>
				{/if}
			</ul>
		</div>
	{/if}
{/snippet}

{#snippet section(
	title: string,
	description: string,
	IconComponent: Component,
	buttonText: string,
	onclick: () => void,
	opts: SectionOpts
)}
	{@const buttonClass = opts?.buttonClass ?? 'justify-start justify-self-start md:w-auto'}
	{@const buttonVariant = opts?.buttonVariant ?? 'outline'}
	<div class="grid gap-1 {opts?.wrapperClass ?? ''}">
		<h4 class="mt-0 mb-2 text-sm font-medium {opts?.titleClass ?? ''}">{title}</h4>

		<p class="mb-4 text-sm text-muted-foreground">{description}</p>

		<Button class={buttonClass} {onclick} variant={buttonVariant}>
			<IconComponent class="mr-2 h-4 w-4" />

			{buttonText}
		</Button>

		{#if opts?.summary}
			{@render summaryList(opts.summary.show, opts.summary.verb, opts.summary.items)}
		{/if}
	</div>
{/snippet}

<div class="space-y-6" in:fade={{ duration: 150 }}>
	<div class="space-y-6">
		{@render section(
			'Export Conversations',
			'모든 대화를 JSON 파일로 다운로드합니다. 모든 메시지, 첨부 파일 및 대화 내역이 포함됩니다.',
			Download,
			'Export conversations',
			handleExportClick,
			{ summary: { show: showExportSummary, verb: '내보내기', items: exportedConversations } }
		)}

		{@render section(
			'Import Conversations',
			'이전에 내보낸 JSON 파일에서 하나 이상의 대화를 가져옵니다. 기존 대화 목록에 추가됩니다.',
			Upload,
			'Import conversations',
			handleImportClick,
			{
				wrapperClass: 'border-t border-border/30 pt-6',
				summary: { show: showImportSummary, verb: '가져오기', items: importedConversations }
			}
		)}

		{@render section(
			'Delete All Conversations',
			'모든 대화와 메시지를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다. 백업을 원하시면 먼저 대화를 내보내는 것을 고려해 보세요.',
			Trash2,
			'Delete all conversations',
			handleDeleteAllClick,
			{
				wrapperClass: 'border-t border-border/30 pt-4',
				titleClass: 'text-destructive',
				buttonVariant: 'destructive',
				buttonClass:
					'text-destructive-foreground justify-start justify-self-start bg-destructive hover:bg-destructive/80 md:w-auto'
			}
		)}
	</div>
</div>

<DialogConversationSelection
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.EXPORT}
	bind:open={showExportDialog}
	onCancel={() => (showExportDialog = false)}
	onConfirm={handleExportConfirm}
/>

<DialogConversationSelection
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.IMPORT}
	bind:open={showImportDialog}
	onCancel={() => (showImportDialog = false)}
	onConfirm={handleImportConfirm}
/>

<DialogConfirmation
	bind:open={showDeleteDialog}
	title="모든 대화 삭제"
	description="정말로 모든 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 대화와 메시지가 영구적으로 삭제됩니다."
	confirmText="모두 삭제"
	cancelText="취소"
	variant="destructive"
	icon={Trash2}
	onConfirm={handleDeleteAllConfirm}
	onCancel={handleDeleteAllCancel}
/>
