import { computed } from 'vue'
import { site } from '~/app/site'

export function useFeatureFlags() {
  const flags = computed(() => site.featureFlags)
  return { flags }
}




