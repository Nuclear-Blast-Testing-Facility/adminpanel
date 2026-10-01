<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-facility-950 text-slate-100">
    <!-- Ambient background glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md relative z-10">
      <div class="admin-card rounded-2xl p-8 border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4 shadow-[0_0_20px_rgba(255,183,3,0.3)]">
            <svg class="w-8 h-8 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span class="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
            RESTRICTED ACCESS LEVEL 99
          </span>
          <h1 class="text-2xl font-display font-bold text-white tracking-wider mt-3">
            NBTF.CA MASTER CONTROL
          </h1>
          <p class="text-xs text-slate-400 font-mono mt-1">
            Administrator Authentication Gateway
          </p>
        </div>

        <!-- Error notification -->
        <div
          v-if="errorMessage"
          class="p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono mb-6 flex items-center gap-2"
        >
          <svg class="w-4 h-4 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="space-y-4 font-mono text-xs">
          <div>
            <label class="block text-slate-300 mb-1.5 font-medium">ADMIN USERNAME</label>
            <div class="relative">
              <input
                v-model="username"
                type="text"
                required
                autocomplete="username"
                placeholder="admin"
                class="w-full px-3.5 py-2.5 bg-facility-900 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-300 mb-1.5 font-medium">CLEARANCE PASSCODE</label>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2.5 bg-facility-900 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(255,183,3,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
            </svg>
            <span>{{ loading ? 'AUTHENTICATING...' : 'ACCESS CONTROL PANEL' }}</span>
          </button>
        </form>

        <!-- Domain disclaimer notice -->
        <div class="mt-8 pt-4 border-t border-slate-800/80 text-center font-mono text-[11px] text-slate-500">
          <p>Managed by cbx.nz &bull; Domain maintainer cbx.kiwi</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('admin')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<{ success: boolean }>('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })

    if (res.success) {
      await navigateTo('/')
    }
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Authentication failed. Please verify credentials.'
  } finally {
    loading.value = false
  }
}
</script>
