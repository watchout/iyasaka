<template>
  <div class="container">
    <h1>Marketing 管理</h1>

    <section>
      <h2>追加（YouTube）</h2>
      <form @submit.prevent="onSubmit">
        <label>
          <div>URL</div>
          <input v-model="url" placeholder="https://www.youtube.com/watch?v=..." />
        </label>
        <label>
          <div>タグ（カンマ区切り）</div>
          <input v-model="tags" placeholder="社会的証明, 損失回避" />
        </label>
        <label>
          <div>原理（カンマ区切り）</div>
          <input v-model="principles" placeholder="Cialdini: 社会的証明, Fogg: Prompt" />
        </label>
        <div>
          <button type="submit">登録</button>
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="okMessage" class="ok">{{ okMessage }}</div>
      </form>
    </section>

    <section>
      <h2>ページ監査</h2>
      <div class="audit">
        <label>
          <div>対象パス</div>
          <input v-model="auditPath" placeholder="/" />
        </label>
        <div>
          <button @click="runAudit" :disabled="auditLoading">{{ auditLoading ? '監査中...' : 'このページを監査' }}</button>
        </div>
        <div v-if="auditResult" class="audit-result">
          <div>スコア: <strong>{{ typeof auditResult.score === 'number' ? `${auditResult.score}%` : '-' }}</strong></div>
          <ul v-if="Array.isArray(auditResult.issues) && auditResult.issues.length">
            <li v-for="i in auditResult.issues" :key="i.id">
              <span class="issue-title">{{ i.title }}</span>
              <span class="issue-sev">({{ i.severity }})</span>
              <div class="issue-fix">{{ i.fix }}</div>
            </li>
          </ul>
          <div v-else>指摘はありません。</div>
        </div>
      </div>
    </section>

    <section>
      <h2>ライブラリ一覧 <span v-if="loading">(読み込み中...)</span></h2>
      <div class="list">
        <div v-for="it in items" :key="it.id" class="card">
          <div class="title">{{ it.title || it.source?.url }}</div>
          <div class="meta">{{ it.type }} ・ {{ new Date(it.createdAt).toLocaleString() }}</div>
          <a v-if="it.source?.url" :href="it.source.url" target="_blank" rel="noreferrer">{{ it.source.url }}</a>
          <div v-if="it.tags?.length" class="small">タグ: {{ it.tags.join(', ') }}</div>
          <div v-if="it.principles?.length" class="small">原理: {{ it.principles.join(', ') }}</div>
        </div>
        <div v-if="!items.length && !loading">まだ登録がありません。</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

interface KnowledgeItem {
  id: string
  type: 'youtube' | 'book' | 'pdf' | 'article' | 'note'
  source?: { url?: string; isbn?: string | null; file?: string | null }
  title: string
  tags?: string[]
  principles?: string[]
  createdAt: string
}

const items = ref<KnowledgeItem[]>([])
const loading = ref(false)
const url = ref('')
const tags = ref('')
const principles = ref('')
const error = ref<string | null>(null)
const okMessage = ref<string | null>(null)

const auditPath = ref('/')
const auditLoading = ref(false)
const auditResult = ref<any | null>(null)

const tagsArray = computed(() => tags.value.split(',').map(s => s.trim()).filter(Boolean))
const principlesArray = computed(() => principles.value.split(',').map(s => s.trim()).filter(Boolean))

async function fetchAll() {
  loading.value = true
  error.value = null
  try {
    const r = await $fetch<{ items: KnowledgeItem[] }>(`/api/knowledge/all`)
    items.value = r.items || []
  } catch (e) {
    error.value = '読み込みに失敗しました'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAll()
})

async function onSubmit() {
  error.value = null
  okMessage.value = null
  try {
    await $fetch(`/api/knowledge/add`, {
      method: 'POST',
      body: { type: 'youtube', url: url.value, tags: tagsArray.value, principles: principlesArray.value }
    })
    okMessage.value = '登録しました'
    url.value = ''
    tags.value = ''
    principles.value = ''
    fetchAll()
  } catch (e) {
    error.value = '登録に失敗しました'
  }
}

async function runAudit() {
  auditLoading.value = true
  auditResult.value = null
  try {
    const r = await $fetch(`/api/marketing/audit`, { params: { path: auditPath.value } })
    auditResult.value = r
  } catch (e) {
    auditResult.value = { ok: false, error: 'audit_failed' }
  } finally {
    auditLoading.value = false
  }
}
</script>

<style scoped>
.container { padding: 24px; max-width: 960px; margin: 0 auto; }
h1 { font-size: 24px; font-weight: 700; }
h2 { font-size: 18px; font-weight: 600; margin-top: 24px; }
form, .audit { display: grid; gap: 12px; margin-top: 12px; }
input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
button { padding: 10px 16px; border-radius: 8px; background: #111; color: #fff; }
.error { color: crimson; }
.ok { color: seagreen; }
.list { margin-top: 12px; display: grid; gap: 8px; }
.card { border: 1px solid #eee; border-radius: 8px; padding: 12px; }
.title { font-weight: 600; }
.meta { font-size: 12px; color: #666; }
.small { margin-top: 6px; font-size: 12px; }
.issue-title { font-weight: 600; }
.issue-sev { margin-left: 8px; font-size: 12px; color: #666; }
.issue-fix { font-size: 12px; }
</style>


