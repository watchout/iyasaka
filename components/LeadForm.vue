<script setup lang="ts">
import type { LeadPayload, BudgetPhase } from '@/app/types/leads'
import { useRoute } from '#imports'
import { useAnalytics } from '~/composables/useAnalytics'

type LeadSource = 'contact_page' | 'lp_form' | 'article_footer' | string

const props = defineProps<{
  primaryProductSlug: string
  source: LeadSource
  articleSlug?: string
  defaultBudgetPhase?: BudgetPhase
}>()

const emit = defineEmits<{
  (e: 'submitted', payload: LeadPayload): void
}>()

const { track } = useAnalytics()
const route = useRoute()

const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  role: '',
  budgetPhase: (props.defaultBudgetPhase ?? 'research') as BudgetPhase,
  notes: '',
  utmSource: route.query.utm_source?.toString() || '',
  utmMedium: route.query.utm_medium?.toString() || '',
  utmCampaign: route.query.utm_campaign?.toString() || '',
  website: '',
  consent: false
})

const onSubmit = async () => {
  if (submitting.value) return
  errorMessage.value = ''
  submitted.value = false

  // 同意チェック
  if (!form.consent) {
    errorMessage.value = '個人情報の取扱いと外部送信規律への同意が必要です。'
    return
  }
  submitting.value = true

  const payload: LeadPayload = {
    name: form.name.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
    phone: form.phone || undefined,
    role: form.role || undefined,
    budgetPhase: form.budgetPhase || undefined,
    primaryProductSlug: props.primaryProductSlug,
    relatedProductSlugs: undefined,
    source: props.source,
    articleSlug: props.articleSlug,
    utmSource: form.utmSource || undefined,
    utmMedium: form.utmMedium || undefined,
    utmCampaign: form.utmCampaign || undefined,
    notes: form.notes || undefined,
    website: form.website || undefined
  }

  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: payload
    })
    submitted.value = true
    track('lead_submit', {
      primaryProductSlug: props.primaryProductSlug,
      source: props.source,
      articleSlug: props.articleSlug,
      utmSource: payload.utmSource,
      utmMedium: payload.utmMedium,
      utmCampaign: payload.utmCampaign
    })
    emit('submitted', payload)
    form.name = ''
    form.email = ''
    form.company = ''
    form.phone = ''
    form.role = ''
    form.notes = ''
    form.website = ''
  } catch (err) {
    console.error(err)
    errorMessage.value = '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div class="sr-only">
      <label>
        ウェブサイト
        <input v-model="form.website" type="text" name="website" autocomplete="off">
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="text-sm font-medium text-sumi">
        お名前（必須）
        <input
          v-model="form.name"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
        >
      </label>
      <label class="text-sm font-medium text-sumi">
        会社名（必須）
        <input
          v-model="form.company"
          type="text"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
        >
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="text-sm font-medium text-sumi">
        メールアドレス（必須）
        <input
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
        >
      </label>
      <label class="text-sm font-medium text-sumi">
        電話番号（任意）
        <input
          v-model="form.phone"
          type="tel"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
        >
      </label>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <label class="text-sm font-medium text-sumi">
        役職・担当（任意）
        <input
          v-model="form.role"
          type="text"
          class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
        >
      </label>
      <div>
        <span class="text-sm font-medium text-sumi">ご検討フェーズ（任意）</span>
        <div class="mt-2 flex flex-wrap gap-3 text-sm">
          <label class="inline-flex items-center gap-1">
            <input v-model="form.budgetPhase" type="radio" value="research" class="text-matsuha focus:ring-matsuha">
            <span>情報収集中</span>
          </label>
          <label class="inline-flex items-center gap-1">
            <input v-model="form.budgetPhase" type="radio" value="comparison" class="text-matsuha focus:ring-matsuha">
            <span>比較検討中</span>
          </label>
          <label class="inline-flex items-center gap-1">
            <input v-model="form.budgetPhase" type="radio" value="ready" class="text-matsuha focus:ring-matsuha">
            <span>導入前提</span>
          </label>
        </div>
      </div>
    </div>

    <label class="block text-sm font-medium text-sumi">
      ご相談内容・現状の設備など（任意）
      <textarea
        v-model="form.notes"
        rows="4"
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:border-matsuha"
      />
    </label>
    <div class="space-y-1">
      <label class="inline-flex items-center gap-2 text-xs text-sumi/80">
        <input
          v-model="form.consent"
          type="checkbox"
          class="rounded border-gray-300 text-matsuha focus:ring-matsuha"
          required
        >
        <span>
          <NuxtLink to="/legal/privacy" class="underline underline-offset-2">
            プライバシーポリシー
          </NuxtLink>
          と
          <NuxtLink to="/external-transmission" class="underline underline-offset-2">
            外部送信規律
          </NuxtLink>
          に同意します。
        </span>
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="btn-primary inline-flex items-center justify-center px-5 py-2 text-sm disabled:opacity-60"
        :disabled="submitting"
      >
        <span v-if="!submitting">送信する</span>
        <span v-else>送信中...</span>
      </button>
      <p v-if="submitted" class="text-xs text-matsuha" role="status">
        送信ありがとうございました。担当者よりご連絡いたします。
      </p>
    </div>

    <p v-if="errorMessage" class="text-xs text-red-600" role="alert">
      {{ errorMessage }}
    </p>
  </form>
</template>


