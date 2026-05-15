<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { settingsStore } from '$lib/stores/settings.svelte';
	import { RotateCcw } from '@lucide/svelte';

	interface Props {
		onReset?: () => void;
		onSave?: () => void;
	}

	let { onReset, onSave }: Props = $props();

	let showResetDialog = $state(false);

	function handleResetClick() {
		showResetDialog = true;
	}

	function handleConfirmReset() {
		settingsStore.forceSyncWithServerDefaults();
		onReset?.();

		showResetDialog = false;
	}

	function handleSave() {
		onSave?.();
	}
</script>

<div class="sticky bottom-0 mx-auto mt-4 flex w-full justify-between p-6">
	<div class="flex gap-2">
		<Button variant="outline" onclick={handleResetClick}>
			<RotateCcw class="h-3 w-3" />

			기본값으로 재설정
		</Button>
	</div>

	<Button onclick={handleSave}>설정 저장</Button>
</div>

<AlertDialog.Root bind:open={showResetDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>설정을 기본값으로 재설정</AlertDialog.Title>
			<AlertDialog.Description>
				모든 설정을 기본값으로 재설정하시겠습니까? 모든 매개변수가 서버의 /props 엔드포인트에서 제공하는 값으로 재설정되고 모든 사용자 정의 구성이 제거됩니다.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>취소</AlertDialog.Cancel>
			<AlertDialog.Action onclick={handleConfirmReset}>기본값으로 재설정</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
